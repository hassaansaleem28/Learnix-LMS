import { styles } from "@/app/styles/style";
import { useLoadUserQuery } from "@/redux-toolkit/features/api/apiSlice";
import { useCreateOrderMutation } from "@/redux-toolkit/features/orders/orderApi";
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = io(ENDPOINT, { transports: ["websocket"] });

type Props = {
  setOpen: (open: boolean) => void;
  data: any;
  user: any;
};

const CheckoutForm = ({ setOpen, data, user }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<any>("");
  const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery({ skip: loadUser ? false : true });
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsLoading(false);
      toast.success("Payment was Successful!");
      setOpen(false);
      createOrder({ courseId: data._id, payment_info: paymentIntent });
    }
  }

  useEffect(
    function () {
      if (orderData) {
        setLoadUser(true);
        socketId.emit("notification", {
          title: "New Order",
          message: `You have a new Order from ${data?.name}`,
          userId: user._id,
        });
        redirect(`/course-access/${data._id}`);
      }
      if (error) {
        if ("data" in error) {
          const errMsg = (error.data as any).message;
          toast.error(errMsg);
        }
      }
    },
    [orderData, error]
  );

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" />
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="px-14 mt-4 ml-16"
      >
        <span id="button-text" className={`${styles.button} mt-2 !h-[35px]`}>
          {isLoading ? "Please wait..." : "Pay now"}
        </span>
      </button>
      {message && (
        <div id="payment-message" className="text-[red] font-[Poppins] pt-2">
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
