export default {
  Name: "organizationnewemailregistered", // template-name
  FriendlyName: "Organization-New-Email-Registered",
  Description: "Notify to the user that a new e-mail has been registered",
  IsDefaultTemplate: false,
  AccountId: null,
  AccountName: "{(accountName}}",
  ApplicationId: null,
  IsPersisted: true,
  IsRemoved: false,
  Type: "",
  Templates: {
    email: {
      To: "{{email}}",
      CC: null,
      BCC: null,
      Subject: "Ação necessária - Novo e-mail cadastrado em uma organização",
      Message: "O e-mail {{email}} foi cadastrado como um novo usuário na organização {{orgInfo.organizationName}} - {{orgInfo.id}}. Complete o cadastro pelo Master Data.",
      Type: "E",
      ProviderId: "00000000-0000-0000-0000-000000000000",
      ProviderName: null,
      IsActive: true,
      withError: false,
    },
    sms: {
      Type: "S",
      ProviderId: null,
      ProviderName: null,
      IsActive: false,
      withError: false,
      Parameters: [],
    },
  },
}
