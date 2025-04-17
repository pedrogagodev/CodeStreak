export function SeparatorWithText({ text }: { text: string }) {
  return (
    <div className="relative flex items-center w-full my-8">
      {/* Linha esquerda */}
      <div className="flex-grow border-t border-gray-300"></div>

      {/* Texto no meio */}
      <span className="flex-shrink mx-4 text-gray-500 text-sm font-medium">
        {text}
      </span>

      {/* Linha direita */}
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
}
