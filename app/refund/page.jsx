import PolicyLayout from "@/components/PolicyLayout";

export default function RefundPolicyPage() {
  return (
    <PolicyLayout title="Refund Policy">
      <div className="space-y-5">
        <h2 className="text-[20px] font-semibold leading-tight sm:text-[24px]">
          Returns, Refund and Exchange Policy
        </h2>

        <p>Effective Date : 28th July 2026</p>
        <p>
          At The Kahwa Company, we strive to provide premium-quality products.
          Due to the nature of food products, our return, refund, and
          cancellation policy is as follows:
        </p>

        <h3 className="font-semibold">Returns :</h3>
        <p>
          For hygiene and food safety reasons, we do not accept returns of
          opened or used products.
        </p>
        <p>A replacement or refund may be provided if:</p>
        <ul className="list-disc pl-5">
          <li>You receive a damaged product.</li>
          <li>You receive the wrong product.</li>
          <li>The package is tampered with upon delivery.</li>
          <li>The product is expired.</li>
        </ul>
        <p>
          Any issue must be reported within 48 hours of delivery by emailing us
          with your order number and clear photographs of the product and
          packaging.
        </p>

        <h3 className="font-semibold">Refunds :</h3>
        <p>Once your request is approved:</p>
        <p>
          Refunds will be processed to the original payment method.
          <br />
          Refunds may take 5-7 business days to reflect, depending on your bank
          or payment provider.
        </p>
        <p>
          Shipping charges are non-refundable unless the error was on our part.
        </p>

        <h3 className="font-semibold">Replacements :</h3>
        <p>
          If your claim is approved, we will send a replacement product at no
          additional cost.
        </p>

        <h3 className="font-semibold">Cancellations :</h3>
        <p>
          Orders can only be cancelled before they are dispatched.
          <br />
          Once an order has been shipped, it cannot be cancelled.
        </p>

        <h3 className="font-semibold">Non-Returnable Items :</h3>
        <p>
          The following items are not eligible for return or refund unless they
          are damaged, defective, or incorrect:
        </p>
        <ul className="list-disc pl-5">
          <li>Opened products</li>
          <li>Used products</li>
          <li>Products damaged due to customer mishandling</li>
          <li>Products purchased during clearance or special promotional sales</li>
        </ul>

        <h3 className="font-semibold">Contact Us :</h3>
        <p>
          If you have any questions regarding returns, refunds, or
          cancellations, please contact us:
        </p>
        <p>The Kahwa Company</p>
        <p>Email: info@thekahwacompany.com</p>
        <p>
          Please mention your order number and attach relevant photographs (if
          applicable) so we can assist you as quickly as possible.
        </p>
      </div>
    </PolicyLayout>
  );
}
