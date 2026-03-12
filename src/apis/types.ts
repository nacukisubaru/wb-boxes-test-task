export interface BoxTariff {
  geoName: string | null;
  warehouseName: string;

  boxDeliveryBase: string;
  boxDeliveryCoefExpr: string;
  boxDeliveryLiter: string;

  boxDeliveryMarketplaceBase: string;
  boxDeliveryMarketplaceCoefExpr: string;
  boxDeliveryMarketplaceLiter: string;

  boxStorageBase: string;
  boxStorageCoefExpr: string;
  boxStorageLiter: string;
}