import EmailUpdate from "@/components/EditCard";

export default function Page() {
  return (
    <div className="mx-26 mt-12">
      <div>
        <p className="font-semibold text-2xl">Profile</p>
      </div>

      <div className="mt-12 w-full">
        <EmailUpdate/>
      </div>
    </div>
  );
}
