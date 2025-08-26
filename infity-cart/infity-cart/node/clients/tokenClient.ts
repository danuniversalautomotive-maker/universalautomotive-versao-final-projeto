import { InstanceOptions, IOContext, JanusClient } from "@vtex/api";

export class TokenClient extends JanusClient {

  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        VtexIdClientAutCookie: ctx.authToken,
      },
      retries: 10,
    })
  }

  public async getLoggedClient(token: string) {
    return this.http.get('/api/vtexid/pub/authenticated/user?authToken='+ token);
  }
}
