import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Admin - TargetTrust Certificados
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
