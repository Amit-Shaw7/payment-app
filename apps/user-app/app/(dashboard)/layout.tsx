import { HomeIcon, TransactionsIcon, TransferIcon } from "../../components/Icons";
import { SidebarItem } from "../../components/SidebarItem";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex">
      <div className="w-72 border-r border-slate-300 min-h-screen mr-4 pt-28">
        <div>
          <SidebarItem
            key={"dashboard"}
            href={"/dashboard"}
            icon={<HomeIcon />}
            title="Home"
          />
          <SidebarItem
            key={"transfer"}
            href={"/transfer"}
            icon={<TransferIcon />}
            title="Transfer"
          />
          <SidebarItem
            key={"transactions"}
            href={"/transactions"}
            icon={<TransactionsIcon />}
            title="Transactions"
          />
          <SidebarItem
            key={"ptp-transfer"}
            href={"/ptp-transfer"}
            icon={<TransactionsIcon />}
            title="P2P TRansfer"
          />
        </div>
      </div>
      {children}
    </div>
  );
}

// Icons Fetched from https://heroicons.com/

