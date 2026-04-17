interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-red-700 bg-red-900/20 p-4">
      <p className="text-sm text-red-400">{message}</p>
    </div>
  );
}
