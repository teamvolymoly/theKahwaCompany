import PolicyLayout from "@/components/PolicyLayout";

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy">
      <div className="space-y-6 text-[14px] sm:text-[16px]">
        <section>
          <h2>Shipping and Delivery</h2>
          <p>
            We offer convenient payment methods, including Prepaid and Cash on
            Delivery (COD).
          </p>
        </section>

        <section>
          <h2>Shipping Rates</h2>
          <p>
            - Free Shipping: Enjoy free shipping on all orders over Rs. 499.
            <br />- Cash on Delivery: Choose our Cash on Delivery service for a
            fee of Rs. 90. COD is available only for orders below Rs. 3000
          </p>
        </section>

        <section>
          <h2>International Shipping</h2>
          <p>
            We offer worldwide shipping as well. Contact for more Information.
          </p>
        </section>

        <section>
          <h2>Processing &amp; Delivery Times</h2>
          <p>
            - Orders are delivered within 3-5 business days
            <br />- Orders received before noon IST (Indian Standard Time)
            usually ship out the same business day.
          </p>
        </section>

        <section>
          <h2>Returns &amp; Cancellations</h2>
          <p>
            We hope you love our Kahwa as much as we do! However, if you&apos;re
            not completely satisfied, we&apos;re here to assist you.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have any questions or need assistance, please reach out to
            our customer support team at Email: info@thekahwacompany.com, WA or
            Call: +91 95822 51241.
            <br />
            We&apos;re here to help you.
          </p>
        </section>

        <p>Thank you for choosing us!</p>
      </div>
    </PolicyLayout>
  );
}
