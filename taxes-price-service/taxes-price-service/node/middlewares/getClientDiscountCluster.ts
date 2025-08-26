import { UserInputError } from "@vtex/api";
import { json } from "co-body";
import axios from "axios";

export async function getClientDiscountCluster(ctx: Context, next: () => Promise<any>) {
  const body: { email: string } = await json(ctx.req);

  try {
    if (!body || !body.email) {
      throw new UserInputError("'email' is required in body request.");
    }

    const customerEmail = String(body.email);
    ctx.state.email = customerEmail;

    const url = `https://universalautomotive.vtexcommercestable.com.br/api/dataentities/CL/search?_fields=0desconto,3desconto,7desconto,10desconto,14desconto&_where=email=${customerEmail}`;
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
