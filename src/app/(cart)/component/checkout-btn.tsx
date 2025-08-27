import { initialisePayment } from "../utils/cart";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function CheckoutButton() {
  const router = useRouter();

  async function handleCheckout() {
    try {
      const res = await initialisePayment();
      console.log(res);

      if (res.data?.authorization_url) {
        // Redirect user to Paystack checkout
        router.replace(res.data.authorization_url);
      } else {
        toast.error("Payment initialization failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  }

  return (
    <button
      onClick={handleCheckout}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      Proceed to Payment
    </button>
  );
}

export default CheckoutButton;
