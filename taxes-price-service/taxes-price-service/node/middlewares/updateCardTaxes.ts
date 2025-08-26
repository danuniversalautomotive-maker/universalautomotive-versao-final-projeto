export async function updateCardTaxes(ctx: Context, next: () => Promise<any>) {
  const {
    state: { orderFormId, shippingValue},
    clients: { checkoutClient, masterdata },
  } = ctx;

  try {
    const orderForm: OrderForm = await checkoutClient.getOrderForm(orderFormId)
    if (!orderForm) {
      throw new Error("orderform not found")
    }

    if(!orderForm?.shippingData?.address?.state) {
      throw new Error("Missing 'state' in orderform")
    }

    const stateTax: UFTax[] = await masterdata.searchDocuments({
      dataEntity: 'UT',
      fields: ['active', 'minValue', 'tax', 'state'],
      where: `state=${orderForm.shippingData.address.state}`,
      pagination: {
        page: 1,
        pageSize: 500,
      }
    })

    if (!stateTax || stateTax.length === 0 || !stateTax?.[0]?.active) {
      ctx.status = 304
      return await next()
    }

    let status = 204;


    if(shippingValue === 0) {
      for (const [index, item] of orderForm.items.entries()) {
        if (item.manualPrice) {
          status = 304;
          continue;
        }

        const priceWithTax = item.sellingPrice * ((stateTax[0].tax / 100) + 1);

        await checkoutClient.setManualPriceForItems(
          orderFormId,
          index,
          Number(priceWithTax.toFixed(0))
        );
        status = 204;
      }

      ctx.status = status
      return await next()
    }

    const hasSomeManualPrice = orderForm.items.some(item => item.manualPrice);
    if(hasSomeManualPrice) {
      const orderItems = orderForm.items.map((item, index) => ({id: item.id, seller: item.seller, quantity: item.quantity, index: index}))
      await checkoutClient.clearCart(orderFormId);
      await checkoutClient.addItems(orderFormId, orderItems)
      const logistic = orderForm.shippingData.logisticsInfo[0].slas.find(item => item.id === orderForm.shippingData.logisticsInfo[0].selectedSla)
      const logisitcItemIndex = orderForm.shippingData.logisticsInfo[0].slas.findIndex(item => item.id === orderForm.shippingData.logisticsInfo[0].selectedSla)
      const logisticsInfo = [
        {
          "itemIndex": logisitcItemIndex,
          "selectedDeliveryChannel": logistic?.deliveryChannel,
          "selectedSla": logistic?.id
        }
      ]
      await checkoutClient.keepShippingSelected(orderFormId, orderForm.shippingData.address, logisticsInfo)

      ctx.status = 204
      return await next()
    }

    ctx.status = 304
    await next()
  } catch (e) {
    console.log("Error:", e)
    ctx.status = 500
    ctx.body = {
      error: e.message
    }
    await next()
  }

}
