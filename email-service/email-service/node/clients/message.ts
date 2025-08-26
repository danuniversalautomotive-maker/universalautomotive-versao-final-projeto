import { JanusClient, InstanceOptions, IOContext } from "@vtex/api";
import { pipe } from "ramda";

import configEmail from "../configs/configEmail";

export interface OrgInfo {
  id: string,
  organizationName: string,
}

interface JsonDataParameters {
  email: string,
  orgInfo: OrgInfo
}

const withCookieAsHeader = (context: IOContext) => (
  options: InstanceOptions
): InstanceOptions => ({
  ...options,
  headers: {
    VtexIdclientAutCookie: context.authToken,
    ...(options?.headers ?? {}),
  },
})

export default class Message extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, options && pipe(withCookieAsHeader(context))(options))
  }

  public async sendMail(
    jsonData: JsonDataParameters,
    templateName: string
  ): Promise<string> {
    const data = {
      templateName: templateName,
      jsonData,
    }

    return this.http.post(`/api/mail-service/pvt/sendmail`, data);
  }

  public async sendTemplate(): Promise<any> {
    const data = {
      ...configEmail,
    }

    return this.http.post(`/api/template-render/pvt/templates`, data);
  }
}
