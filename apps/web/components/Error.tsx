export default function ErrorPage({errorMessage} : {errorMessage : string}) {
  return (
    <div className="w-full">
      <p className="text-center">{errorMessage}</p>
    </div>
  );
}
