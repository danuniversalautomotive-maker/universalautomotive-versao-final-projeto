import { json } from "co-body";
import getOrganizationInfo from "./getOrganizationInfo";

export async function sendEmail(ctx: Context, next: () => Promise<any>) {

  const body = await json(ctx.req);

  const orgInfoRes: any = await getOrganizationInfo(ctx, body.email);
  console.log("sendEmail orgInfoRes", orgInfoRes);

  // TODO
  //   this only makes sense if the user is registered in only 1 organization.
  //   if the user can impersonate then this will send the email for just one
  //   organization and probably the wrong one.
  const orgInfo: any = orgInfoRes?.data?.getOrganizationsByEmail[0];
  console.log("sendEmail orgInfo", orgInfo);

  try {
    ctx.clients.message
      .sendMail({ email: body.email, orgInfo }, "organizationnewemailregistered")
      .then(async () => {
        ctx.status = 200;
        ctx.body = "ok";
      }).catch((err) => {
        console.error("@Error: ", err);
        ctx.status = err.status || 500;
        ctx.body = { error: { message: err.message } };
      });
  } catch (err) {
    console.error("#Error: ", err);
    ctx.status = err.status || 500;
    ctx.body = {
      error: {
        message: err.message
      }
    };
  }

  await next();
}
