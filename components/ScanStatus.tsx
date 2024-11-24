interface ScanStatusProps {
    status: string;
  }
  
  export function ScanStatus({ status }: ScanStatusProps) {
    return (
      <div className="bg-[#1e1f2e] p-4 rounded-lg mb-6 text-center font-bold text-[#9945FF]">
        {status}
      </div>
    )
  }
  