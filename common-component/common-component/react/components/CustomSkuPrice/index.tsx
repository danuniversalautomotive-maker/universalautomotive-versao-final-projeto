import React, { useEffect, useState } from 'react';
import { useProduct } from 'vtex.product-context';

const CustomSkuPrice = () => {

  const productContext = useProduct();
  const [discountClusters, setDiscountClusters] = useState<any>(null);

  useEffect(() => {
    const _discountClusters: any = sessionStorage.getItem("clientCluster") ? JSON.parse(sessionStorage.getItem("clientCluster") as string) : {
      "0desconto": true,
      "3desconto": false,
      "7desconto": false,
      "10desconto": false,
      "14desconto": false,
    };
    setDiscountClusters(_discountClusters);
  }, []);

  const skuUnitMultiplier = productContext?.selectedItem?.unitMultiplier;

  const activeDiscountCluster = discountClusters && Object.keys(discountClusters).find(key => discountClusters[key]);
  const clusterDiscount = parseInt(activeDiscountCluster?.split("desconto")[0] || "0", 10) ?? 0;

  const discountPercentage = 0.30 + (clusterDiscount / 100);

  const listPrice: number = productContext?.selectedItem?.sellers?.find((s: any) => s?.sellerDefault)?.commertialOffer?.ListPrice as number;

  const calculatedPrice = Math.ceil((listPrice - (listPrice * discountPercentage)) * 100) / 100;

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
  }

  return (
    <table className={"ssesandbox04-b2b-suite-bra-1-x-priceByQuantityTable"}>
      <tbody>
        <tr className={"ssesandbox04-b2b-suite-bra-1-x-priceByQuantityHeader"}>
          <th className={"bg-muted-4"}>
            {skuUnitMultiplier}+
          </th>
        </tr>
        <tr>
          <td align={"center"} className={"ssesandbox04-b2b-suite-bra-1-x-priceByQuantityValue"}>
            <span className={"ssesandbox04-b2b-suite-bra-1-x-currencyContainer"}>
              {formatCurrency(calculatedPrice)}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default CustomSkuPrice;
