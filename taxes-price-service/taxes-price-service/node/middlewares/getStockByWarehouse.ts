import { UserInputError } from '@vtex/api';
import { json } from 'co-body';
import axios from 'axios';

export async function getStockByWarehouse(ctx: Context, next: () => Promise<any>) {
  const body: { skuID: string } = await json(ctx.req);

  try {
    if (!body || !body.skuID) {
      throw new UserInputError("'skuIDs' is required in body request.");
    }

    const skuID = String(body.skuID);
    ctx.state.skuID = skuID;

    const url = `https://universalautomotive.vtexcommercestable.com.br/api/logistics/pvt/inventory/skus/${skuID}`;
    const options = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        VtexIdclientAutCookie: ctx.vtex.authToken ?? ctx.vtex.adminUserAuthToken ?? "",
      },
    };


    const res = await axios.get(url, options);
    const { data } = res;

    ctx.status = 200;
    ctx.body = {
      data: data,
    };

    await next();
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      error: e.message,
    };
  }
}
