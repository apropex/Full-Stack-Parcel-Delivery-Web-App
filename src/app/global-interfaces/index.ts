//

export enum eAddressType {
  home = "home",
  office = "office",
  other = "other",
}

export interface iAddress {
  street: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
  landmark?: string;
  addressType?: eAddressType;
}

export interface iReqQueryParams {
  search?: string;
  sort?: string;
  fields?: string;
  page?: string;
  limit?: string;
  [key: string]: string | undefined;
}
