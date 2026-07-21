import type { ProductCatalog } from "./productCatalog";

export const submissionCatalog: ProductCatalog = {
  markets: [
    { key: "연남", market_id: "3110562", name: "연남동 골목상권", address: "마포구 동교로 38길 일대", center: [126.922787722224, 37.5634957461626] },
    { key: "홍대", market_id: "3120103", name: "홍대입구역 상권", address: "마포구 양화로 일대", center: [126.919317433833, 37.5527848842777] },
    { key: "합정", market_id: "3120101", name: "합정역 상권", address: "마포구 양화로 45 일대", center: [126.91324192136, 37.5492309987762] },
  ],
  categories: [
    { name: "카페", codes: ["CS100010"] },
    { name: "음식점", codes: ["CS100001"] },
    { name: "베이커리", codes: ["CS100005"] },
    { name: "편의점", codes: ["CS300002"] },
  ],
  radii: [100, 300, 500],
};
