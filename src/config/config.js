/*
* 公用配置文件
*
* */
import {AsyncStorage} from "react-native";

//http or https
export const BASE_TYPE = "http://";

// export const BASE_URL = "http://192.168.0.183:8288";
// export const BASE_URL = "http://192.168.0.182:8488";

export const BASE_IP = "118.186.224.167";

export const BASE_PORT = "8288";

export const BASE_URL = async () => {
  const nowIp = await AsyncStorage.getItem('base_ip');
  const nowPort = await AsyncStorage.getItem('base_port');
  const ip = nowIp || BASE_IP
  const port = nowPort || BASE_PORT;
  return BASE_TYPE + ip + ':' + port
};
