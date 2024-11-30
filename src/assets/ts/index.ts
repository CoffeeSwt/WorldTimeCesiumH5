import { Cartesian3, Viewer, WebMapTileServiceImageryProvider } from "cesium";

export class CesiumBox {
  private initQuene: Function[];
  tdtToken?: string; //天地图Token
  options?: Viewer.ConstructorOptions;
  viewer?: Viewer;
  constructor() {
    this.initQuene = [];
    return this;
  }
  init = (dom: Element) => {
    this.viewer = new Viewer(dom, this.options);
    this.initQuene.forEach((f) => {
      console.log(f);
      f();
    });
    this.initQuene.length = 0;
    this.setView();
    return this;
  };
  setOptions = (options: Viewer.ConstructorOptions) => {
    this.options = options;
    return this;
  };
  withTDTToken(token: string) {
    this.tdtToken = token;
    return this;
  }
  useVecBasicLayer(token?: string) {
    this.initQuene.push(() => {
      this.viewer?.imageryLayers.addImageryProvider(
        new WebMapTileServiceImageryProvider({
          url:
            "http://t7.tianditu.gov.cn/vec_w/wmts?tk=" +
            (token ?? this.tdtToken),
          layer: "tdtVecBasicLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
          // show: false
        })
      );
    });
    return this;
  }
  useVecLayerTags(token?: string) {
    this.initQuene.push(() => {
      this.viewer?.imageryLayers.addImageryProvider(
        new WebMapTileServiceImageryProvider({
          url:
            "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" +
            (token ?? this.tdtToken),
          layer: "tdtAnnoLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
        })
      );
    });
    return this;
  }
  resetDefaultCamPosition() {
    this.viewer?.camera.flyTo({
      destination: Cartesian3.fromDegrees(116.3912757, 39.906217, 900000),
      orientation: {
        heading: 0,
        pitch: -Math.PI / 2,
        roll: 0,
      },
    });
  }
  private setView(
    destination: {
      latitude: number;
      longitude: number;
      altitude: number;
    } = {
      latitude: 39.906217,
      longitude: 116.3912757,
      altitude: 900000,
    },
    orientation: {
      heading: number;
      // 视角
      pitch: number;
      roll: number;
    } = {
      heading: 0,
      pitch: -Math.PI / 2,
      roll: 0,
    }
  ) {
    this.viewer?.camera.setView({
      // Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
      // fromDegrees()方法，将经纬度和高程转换为世界坐标
      destination: Cartesian3.fromDegrees(
        destination.longitude,
        destination.latitude,
        destination.altitude
      ),
      orientation,
    });
  }
}
