import React, { useEffect, useState } from "react";
import convertMoney from "../convertMoney";
import { Link } from "react-router-dom";
import CheckoutAPI from "../API/CheckoutAPI";
import { toast } from "react-toastify";
import "./Checkout.css";

import { io } from "socket.io-client";
import Loading from "../Loading/Loading";
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

function Checkout(props) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [carts, setCarts] = useState([]);
  const [total, setTotal] = useState(0);

  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [emailRegex, setEmailRegex] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  //Hàm này dùng để gọi API và render số sản phẩm
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setCarts(user.cart.items);
        getTotal(user.cart.items);
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  //Hàm này dùng để tính tổng tiền carts
  function getTotal(carts) {
    let sub_total = 0;
    carts.map((value) => {
      return (sub_total +=
        parseInt(value.priceProduct) * parseInt(value.quantity));
    });

    setTotal(sub_total);
  }

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const handlerSubmit = (e) => {
    e.preventDefault();

    if (!fullName) {
      setFullNameError(true);
      setEmailError(false);
      setPhoneError(false);
      setAddressError(false);
      return;
    } else {
      if (!email) {
        setFullNameError(false);
        setEmailError(true);
        setPhoneError(false);
        setAddressError(false);
        return;
      } else {
        setPhoneError(false);
        setAddressError(false);
        setFullNameError(false);

        if (!validateEmail(email)) {
          setEmailRegex(true);
          setFullNameError(false);
          setEmailError(false);
          setPhoneError(false);
          setAddressError(false);
          return;
        } else {
          setEmailRegex(false);

          if (!phone) {
            setFullNameError(false);
            setEmailError(false);
            setPhoneError(true);
            setAddressError(false);
            return;
          } else {
            setFullNameError(false);
            setEmailError(false);
            setPhoneError(false);
            setAddressError(false);

            if (!address) {
              setFullNameError(false);
              setEmailError(false);
              setPhoneError(false);
              setAddressError(true);
            } else {
              const sendMail = async () => {
                const params = {
                  email: email,
                  fullName: fullName,
                  phone: phone,
                  address: address,
                  total: total,
                  idUser: user._id,
                };
                await CheckoutAPI.postOrder(params);
              };
              sendMail();
              const data = user._id;

              // Gửi socket lên server
              socket.emit("send_order", data);

              toast.success("Bạn Đã Đặt Hàng Thành Công!");
              setSuccess(true);
            }
          }
        }
      }
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div className="container">
            <section className="py-5 bg-light">
              <div className="container">
                <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
                  <div className="col-lg-6">
                    <h1 className="h2 text-uppercase mb-0">Checkout</h1>
                  </div>
                  <div className="col-lg-6 text-lg-right">
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                        <li className="breadcrumb-item">
                          <Link to="/">Home</Link>
                        </li>
                        <li className="breadcrumb-item">
                          <Link to="/cart">Cart</Link>
                        </li>
                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          Checkout
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </section>

            {!success && (
              <section className="py-5">
                <h2 className="h5 text-uppercase mb-4">Billing details</h2>
                <div className="row">
                  <div className="col-lg-8">
                    <form>
                      <div className="row">
                        <div className="col-lg-12 form-group">
                          <label
                            className="text-small text-uppercase"
                            htmlFor="Fullname"
                          >
                            Full Name:
                          </label>
                          <input
                            className="form-control form-control-lg"
                            type="text"
                            name={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                          {fullNameError && (
                            <span className="text-danger">
                              * Please Check Your Full Name!
                            </span>
                          )}
                        </div>
                        <div className="col-lg-12 form-group">
                          <label
                            className="text-small text-uppercase"
                            htmlFor="Email"
                          >
                            Email:{" "}
                          </label>
                          <input
                            className="form-control form-control-lg"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          {emailError && (
                            <span className="text-danger">
                              * Please Check Your Email!
                            </span>
                          )}
                          {emailRegex && (
                            <span className="text-danger">
                              * Incorrect Email Format
                            </span>
                          )}
                        </div>
                        <div className="col-lg-12 form-group">
                          <label
                            className="text-small text-uppercase"
                            htmlFor="Phone"
                          >
                            Phone Number:{" "}
                          </label>
                          <input
                            className="form-control form-control-lg"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                          {phoneError && (
                            <span className="text-danger">
                              * Please Check Your Phone Number!
                            </span>
                          )}
                        </div>
                        <div className="col-lg-12 form-group">
                          <label
                            className="text-small text-uppercase"
                            htmlFor="Address"
                          >
                            Address:{" "}
                          </label>
                          <input
                            className="form-control form-control-lg"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter Your Address Here!"
                          />
                          {addressError && (
                            <span className="text-danger">
                              * Please Check Your Address!
                            </span>
                          )}
                        </div>
                        <div className="col-lg-12 form-group">
                          <button
                            className="btn btn-dark"
                            style={{ color: "white" }}
                            type="submit"
                            onClick={handlerSubmit}
                          >
                            Place order
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="col-lg-4">
                    <div className="card border-0 rounded-0 p-lg-4 bg-light">
                      <div className="card-body">
                        <h5 className="text-uppercase mb-4">Your order</h5>
                        <ul className="list-unstyled mb-0">
                          {carts &&
                            carts.map((value) => (
                              <div key={value._id}>
                                <li className="d-flex align-items-center justify-content-between">
                                  <strong className="small font-weight-bold">
                                    {value.nameProduct}
                                  </strong>
                                  <span className="text-muted small">
                                    {`${convertMoney(value.priceProduct)} x
                                ${value.quantity}`}
                                  </span>
                                </li>
                                <li className="border-bottom my-2"></li>
                              </div>
                            ))}
                          <li className="d-flex align-items-center justify-content-between">
                            <strong className="text-uppercase small font-weight-bold">
                              Total
                            </strong>
                            <span>{convertMoney(total)} VND</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {success && (
              <section className="py-5">
                <div className="p-5">
                  <h1>You Have Successfully Ordered!</h1>
                  <p style={{ fontSize: "1.2rem" }}>Please Check Your Email.</p>
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Checkout;
