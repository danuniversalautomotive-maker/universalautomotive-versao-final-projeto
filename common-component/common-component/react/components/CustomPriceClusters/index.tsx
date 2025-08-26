import React, { useEffect, useState } from 'react';
import { useProduct } from 'vtex.product-context';
import { useOrderForm } from 'vtex.order-manager/OrderForm';

import styles from './styles.css';

const CustomPriceClusters = () => {

  const [discountClusters, setDiscountClusters] = useState<any>(null);

  const productContext = useProduct();
  const { orderForm } = useOrderForm();
  const customerEmail = orderForm?.clientProfileData?.email;

  useEffect(() => {
    if (!customerEmail) return;

    const cachedData = sessionStorage.getItem("clientCluster");
    if (cachedData) {
      setDiscountClusters(JSON.parse(cachedData));
    } else {
      const options = {
        method: "POST",
        body: JSON.stringify({
          email: customerEmail,
        })
      }

      fetch(`/_v/get-client-discount-cluster/`, options)
        .then(res => res.json())
        .then(res => {
          const defaultClientCluster = {
            "0desconto": true,
            "3desconto": false,
            "7desconto": false,
            "10desconto": false,
            "14desconto": false,
          };

          const fetchedClusters = res?.data?.length > 0 ? res.data[0] : defaultClientCluster;

          sessionStorage.setItem("clientCluster", JSON.stringify(fetchedClusters));
          setDiscountClusters(fetchedClusters);
        })
        .catch((error) => {
          console.error("Failed to fetch discountClusters:", error);
        });
    }
  }, [customerEmail])

  if (!discountClusters || !productContext) return null;

  const activeDiscountCluster = discountClusters && Object.keys(discountClusters).find(key => discountClusters[key]);
  const clusterDiscount = parseInt(activeDiscountCluster?.split("desconto")[0] || "0", 10) ?? 0;

  const discountPercentage = 0.30 + (clusterDiscount / 100);

  const listPrice: number = productContext?.selectedItem?.sellers?.find((s: any) => s?.sellerDefault)?.commertialOffer?.ListPrice as number;

  const calculatedPrice = Math.ceil((listPrice - (listPrice * discountPercentage)) * 100) / 100;
  const installments = Math.ceil((calculatedPrice / 2) * 100) / 100;

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
  }

  // TODO - add this price logic to the price comparison component in PLP

  return (
    <div className={styles.CustomPriceClusters_Container}>
      <span className={styles.CustomPriceClusters_Price}>{formatCurrency(calculatedPrice)}</span>
      {clusterDiscount > 0 && (
        <span className={styles.CustomPriceClusters_PriceInfo}>Antecipado ({clusterDiscount}% desconto)</span>
      )}
      <span className={styles.CustomPriceClusters_PriceInfo}>Em até 2x {formatCurrency(installments)} sem juros</span>
    </div>
  );
}

export default CustomPriceClusters;
