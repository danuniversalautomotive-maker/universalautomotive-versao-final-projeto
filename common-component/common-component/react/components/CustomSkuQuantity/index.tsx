import React, { useEffect, useState } from 'react';
import { useProduct } from 'vtex.product-context';
import { useOrderForm } from 'vtex.order-manager/OrderForm';

const CustomSkuQuantity = () => {

  const productContext = useProduct();
  const { orderForm } = useOrderForm();

  const vtexNativeAvailableQuantity = productContext?.selectedItem?.sellers[0]?.commertialOffer?.AvailableQuantity;

  const [skuID, setSkuID] = useState<any>([]);
  const [maxQTDbyWarehouse, setMaxQTDbyWarehouse] = useState<any>(0);
  const [userStateInfo, setUserStateInfo] = useState<any>("");

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

  return (
    <div className={"pt3 pb5 t-body c-muted-1 lh-copy ssesandbox04-b2b-suite-bra-1-x-inventoryContainer"}>
      <span className={"ssesandbox04-b2b-suite-bra-1-x-inventory cadastra-warehouse-inventory-quantity"}>
        {maxQTDbyWarehouse || vtexNativeAvailableQuantity}
      </span>
    </div>
  );
}

export default CustomSkuQuantity;
