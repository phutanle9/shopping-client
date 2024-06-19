import axiosClient from "./axiosClient";

const HistoryAPI = {
  getHistoryAPI: () => {
    const url = `/orders`;
    return axiosClient.get(url);
  },

  getDetail: (id) => {
    const url = `/orders/${id}`;
    return axiosClient.get(url);
  },
};

export default HistoryAPI;
