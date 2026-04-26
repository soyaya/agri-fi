import Link from 'next/link';
import { getOpenDeals } from '@/lib/api';
import FundingProgressBar from '@/components/FundingProgressBar';

// Render on demand so CI build does not need a reachable backend.
export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function MarketplacePage() {
  let deals = [];
  try {
    deals = await getOpenDeals();
  } catch {
    // show empty state on error
  }

  // filter to open only (belt-and-suspenders in case API returns others)
  const openDeals = deals.filter((d: { status: string }) => d.status === 'open');

  return (
    <main className="min-h-screen bg-green-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Trade Deal Marketplace</h1>
        <p className="text-green-600 mb-8">Browse open agricultural trade deals available for investment.</p>

        {openDeals.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-xl">No open deals at the moment.</p>
            <p className="text-sm mt-2">Check back soon for new opportunities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {openDeals.map((deal) => (
              <Link
                key={deal.id}
                href={`/marketplace/${deal.id}`}
                className="bg-white rounded-2xl shadow-sm border border-green-100 p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 capitalize">{deal.commodity}</h2>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Open</span>
                </div>

                <div className="text-sm text-gray-500 space-y-1">
                  <p>Quantity: <span className="text-gray-700 font-medium">{Number(deal.quantity).toLocaleString()} {deal.quantity_unit}</span></p>
                  <p>Total Value: <span className="text-gray-700 font-medium">${Number(deal.total_value).toLocaleString()}</span></p>
                  <p>Delivery: <span className="text-gray-700 font-medium">{new Date(deal.delivery_date).toLocaleDateString()}</span></p>
                </div>

                <FundingProgressBar totalValue={Number(deal.total_value)} totalInvested={Number(deal.total_invested)} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
