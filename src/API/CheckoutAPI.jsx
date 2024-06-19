import axiosClient from "./axiosClient";

const CheckoutAPI = {
  postOrder: (data) => {
    const url = `/orders`;
    return axiosClient.post(url, data);
  },
};

export default CheckoutAPI;
