import React, { useEffect, useState } from 'react';
import { useProduct, useProductDispatch } from 'vtex.product-context';
import { useOrderForm } from 'vtex.order-manager/OrderForm';

import styles from './styles.css';

const CustomSkuSelector = () => {

  const productContext = useProduct();
  const productDispatch = useProductDispatch();
  const { orderForm } = useOrderForm();

  const [skuID, setSkuID] = useState<any>([]);
  const [maxQTDbyWarehouse, setMaxQTDbyWarehouse] = useState<any>(0);
  const [userStateInfo, setUserStateInfo] = useState<any>("");
  const [inputQuantity, setInputQuantity] = useState<string>("0");

  useEffect(() => {
    setUserStateInfo(orderForm?.shipping?.selectedAddress?.state);
    setSkuID([parseInt(productContext?.selectedItem?.itemId!)]);
  }, [productContext?.selectedItem , orderForm])

  useEffect(() => {
    if (userStateInfo) {
      const options = {
        method: "POST",
        body: JSON.stringify({
          skuID: skuID,
        })
      }

      fetch(`/_v/get-sku-stock-by-warehouse/`, options)
        .then(res => res.json())
        .then(res => {
          let availableWarehousesQTD = 0;
          if (res?.data?.balance !== null) {
            const availableWarehouses = res?.data?.balance?.filter((i: any) => i?.warehouseName?.split("-")[0]?.includes(userStateInfo));
            availableWarehouses?.forEach((i: any) => {
              availableWarehousesQTD += i?.totalQuantity;
            })
          } else {
            // fallback to vtex native AvailableQuantity
            availableWarehousesQTD = productContext?.selectedItem?.sellers[0]?.commertialOffer?.AvailableQuantity as number || 0;
          }

          setMaxQTDbyWarehouse(availableWarehousesQTD);
        })
        .catch((error) => {
          console.error("Failed to fetch SKU stock by warehouse:", error);
        });
    }
  }, [productContext?.selectedItem, skuID, userStateInfo])

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '0' || value === '') {
      setInputQuantity(value);
      return;
    }

    const numericValue = value.replace(/[^0-9]/g, '');

    const numericQuantity = numericValue === '' ? 0 : parseInt(numericValue, 10);

    if (numericQuantity >= 0 && numericQuantity <= maxQTDbyWarehouse) {
      setInputQuantity(numericValue);
    } else if (numericQuantity > maxQTDbyWarehouse) {
      setInputQuantity(maxQTDbyWarehouse.toString());
    }
  }

  const handleBlur = () => {
    if (inputQuantity === '' || inputQuantity === '0') {
      setInputQuantity('0');
      return;
    }

    const trimmedValue = inputQuantity.replace(/^0+/, '');

    const numericQuantity = trimmedValue === '' ? 0 : parseInt(trimmedValue, 10);

    if (numericQuantity >= 0 && numericQuantity <= maxQTDbyWarehouse) {
      setInputQuantity(numericQuantity.toString());
    } else if (numericQuantity > maxQTDbyWarehouse) {
      setInputQuantity(maxQTDbyWarehouse.toString());
    }
  }

  const decrementQuantity = () => {
    const currentValue = inputQuantity === '' ? 0 : parseInt(inputQuantity, 10);
    if (currentValue > 0) {
      setInputQuantity((currentValue - 1).toString());
    }
  }

  const incrementQuantity = () => {
    const currentValue = inputQuantity === '' ? 0 : parseInt(inputQuantity, 10);
    if (currentValue < maxQTDbyWarehouse) {
      setInputQuantity((currentValue + 1).toString());
    }
  }

  useEffect(() => {
    if (productDispatch) {
      const quantity = inputQuantity === '' ? 0 : parseInt(inputQuantity, 10);
      productDispatch({
        type: "SET_QUANTITY",
        args: {
          quantity,
        }
      });
    }
  }, [inputQuantity]);

  return (
    <div className={styles.CustomSkuSelector_Container}>
      <div className={"vtex-numeric-stepper__minus-button-container numeric-stepper__minus-button-container z-2 order-0 flex-none"}>
        <button
          onClick={decrementQuantity}
          disabled={inputQuantity === '' || parseInt(inputQuantity, 10) === 0}
          className={"vtex-numeric-stepper__minus-button numeric-stepper__minus-button br2 pa0 br-0 flex items-center justify-center ba b--muted-4 bw1  h-small f6  pointer bg-base c-action-primary  "}
        >
          －
        </button>
      </div>
      <input
        value={inputQuantity}
        onChange={handleUserInput}
        onBlur={handleBlur}
        className={"vtex-numeric-stepper__input numeric-stepper__input z-1 order-1 tc bw1 ba b--muted-4 bw1  br0 h-small t-small w3  ssesandbox04-b2b-suite-bra-1-x-hideDecorators"}
      />
        <div className={"vtex-numeric-stepper__plus-button-container numeric-stepper__plus-button-container z-2 order-2 flex-none"}>
        <button
          onClick={incrementQuantity}
          disabled={inputQuantity === '' || parseInt(inputQuantity, 10) === maxQTDbyWarehouse}
          className={"vtex-numeric-stepper__plus-button numeric-stepper__plus-button br2 pa0 bl-0 flex items-center justify-center ba b--muted-4 bw1  h-small f6  pointer bg-base c-action-primary  "}
        >
          ＋
        </button>
      </div>
    </div>
  );
}

export default CustomSkuSelector;
