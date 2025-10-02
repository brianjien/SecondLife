import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, LogOut, Plus, Search, Heart, Package, CreditCard, X, Check, Wallet, ArrowLeft, Lock, ChevronLeft, ChevronRight, UploadCloud, Tag, ChevronDown, Edit, Bell, Send, CornerDownLeft, MessageSquare, Shield, Settings, Star, Camera, QrCode, HelpCircle } from 'lucide-react';
import { io } from "socket.io-client";

const API_URL = 'http://localhost:8080';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [fav, setFav] = useState([]);
  const [view, setView] = useState('home');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [listerProfile, setListerProfile] = useState(null);
  const [cat, setCat] = useState('All');
  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [checkout, setCheckout] = useState(false);
  const [addCard, setAddCard] = useState(false);
  const [cardAdded, setCardAdded] = useState(false);
  const [addCredit, setAddCredit] = useState(false);
  const [showWinterAd, setShowWinterAd] = useState(true);
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '', address: '', phone: '' });
  const [countryCode, setCountryCode] = useState('+1');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const countryDropdownRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const [authErrors, setAuthErrors] = useState({});
  const [newProd, setNewProd] = useState({ name: '', price: '', desc: '', cat: 'Fashion', cond: 'Good', imageUrls: [], discount: 0, stock: 1 });
  const [newProdErrors, setNewProdErrors] = useState({});
  const [cardForm, setCardForm] = useState({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });
  const [credit, setCredit] = useState('');
  const [selCard, setSelCard] = useState(null);
  const [imageCarouselIndex, setImageCarouselIndex] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [lastOrder, setLastOrder] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wallet');
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const [returnRequest, setReturnRequest] = useState({ isOpen: false, order: null, reason: '' });
  const [appState, setAppState] = useState(''); // 'loading-in', 'logging-out'
  const [showSuccessModal, setShowSuccessModal] = useState({show: false, message: '', subMessage: ''});
  const [adminView, setAdminView] = useState('users');
  const [messages, setMessages] = useState({});
  const [chatInput, setChatInput] = useState('');
  const chatMessagesRef = useRef(null);
  const [allCoupons, setAllCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'percentage', value: '', minPurchase: '', category: 'All', quantity: ''});
  const [ratingModal, setRatingModal] = useState({ isOpen: false, order: null, rating: 0, hoverRating: 0, comment: '', photo: null });
  const [newQuestion, setNewQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [qrCodeModal, setQrCodeModal] = useState({ isOpen: false, orderId: null });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const productsRes = await fetch(`${API_URL}/products`);
      const productsData = await productsRes.json();
      setProducts(productsData || []);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchCurrentUser = async () => {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API_URL}/users/${currentUser.id}`);
        if (!res.ok) throw new Error("Could not refetch user data");
        const data = await res.json();
        setCurrentUser(data);
    } catch (error) {
        console.error("Failed to refetch user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,flag');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const formattedCountries = data.filter(c => c.idd?.root).map(c => ({ name: c.name.common, code: `${c.idd.root}${c.idd.suffixes?.[0] || ''}`, flag: c.flag })).sort((a, b) => a.name.localeCompare(b.name)).filter((c, i, self) => i === self.findIndex(t => t.code === c.code));
        setCountries(formattedCountries);
        if (formattedCountries.length > 0) setCountryCode(formattedCountries.find(c => c.code === '+1')?.code || formattedCountries[0].code);
      } catch (error) {
        console.error("Failed to fetch country codes:", error);
        setCountries([{ name: "USA", code: "+1", flag: "🇺🇸" }, { name: "Taiwan", code: "+886", flag: "🇹🇼" }]);
        setCountryCode("+1");
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) setIsCountryDropdownOpen(false);
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) setIsCategoryMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cats = ['All', 'Fashion', 'Electronics', 'Music', 'Books', 'Home Goods', 'Sports', 'Toys', 'Art'];

  const Logo = () => (
    <div className="flex items-center gap-2">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-lg">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 16.4531C16.4485 16.3453 16.8923 16.2223 17.3304 16.0833C19.0472 15.5345 20.4482 14.1221 20.9854 12.3929C21.5227 10.6637 21.0631 8.78333 19.8333 7.33333C18.6036 5.88333 16.7583 5 14.7857 5H9C7.34315 5 6 6.34315 6 8V12C6 13.6569 7.34315 15 9 15H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 19L17 16L14 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SecondLife</h1>
    </div>
  );

  const CheckAnimation = () => (
      <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
          <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
      </svg>
  );

  const calculateDiscountedPrice = (price, discount) => discount > 0 ? price * (1 - discount / 100) : price;

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && (cat === 'All' || p.cat === cat) && p.status === 'available' && (!currentUser || p.sellerId !== currentUser.id));
  const myList = currentUser ? products.filter(p => p.sellerId === currentUser.id) : [];
  const userCards = currentUser?.cards || [];
  const availableCouponsForUser = currentUser?.coupons || [];

  const handleAuth = async () => {
    // ... (same as before)
  };

  const handleLogout = () => {
    setAppState('logging-out');
    setTimeout(() => {
      setCurrentUser(null);
      setCart([]);
      setFav([]);
      setView('home');
      setAppState('');
    }, 1000);
  };

  const handleUpdateSale = async (e, saleId) => {
    e.preventDefault();
    const payload = {
        status: e.target.status.value,
        shippingInfo: {
            service: e.target.service.value,
            appointment: e.target.appointment.value,
        },
    };

    try {
        const response = await fetch(`${API_URL}/sales/${saleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to update sale');
        await refetchCurrentUser();
        alert('Sale updated successfully!');
    } catch (error) {
        console.error("Failed to update sale:", error);
        alert('Failed to update sale.');
    }
  };

  const handleProcessReturn = async (saleId, decision) => {
    try {
        const response = await fetch(`${API_URL}/sales/${saleId}/return`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ decision }),
        });
        if (!response.ok) throw new Error('Failed to process return');
        await refetchCurrentUser();
        alert('Return processed successfully!');
    } catch (error) {
        console.error("Failed to process return:", error);
        alert('Failed to process return.');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div>Loading...</div></div>
  }

  return (
    <>
    <style>{`
      /* ... styles ... */
    `}</style>
    <div className={`min-h-screen bg-slate-50 font-sans text-slate-800`}>
      <header>
        {/* ... header JSX ... */}
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {view === 'home' && (
            <div>{/* Home view JSX */}</div>
        )}
        {view === 'profile' && currentUser && (
          <div className="max-w-4xl mx-auto space-y-6">
              {/* Profile view JSX from previous step */}
          </div>
        )}
        {view === 'sales' && currentUser && (
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => setView('profile')} className="p-2 hover:bg-slate-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
                    <h2 className="text-2xl font-bold">My Sales</h2>
                </div>
                {currentUser.sales && currentUser.sales.length > 0 ? (
                    <div className="space-y-6">
                        {currentUser.sales.map(sale => (
                            <div key={sale.orderId} className="bg-white rounded-xl p-6 border border-slate-100">
                                <div className="md:flex justify-between items-start border-b pb-4 mb-4">
                                    <div>
                                        <p className="font-bold text-lg text-blue-600">Order ID: {sale.orderId}</p>
                                        <p className="text-sm text-slate-500">Date: {new Date(sale.date).toLocaleString()}</p>
                                    </div>
                                    <div className="mt-2 md:mt-0 md:text-right">
                                        <p className="font-semibold">Buyer: {sale.buyerName}</p>
                                        <p className="text-sm text-slate-500">{sale.buyerAddress}</p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    {sale.items.map(item => (
                                        <div key={item.id} className="flex items-center gap-4 py-2">
                                            <img src={item.imageUrls[0]} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                                            <div className="flex-grow">
                                                <p className="font-semibold text-sm">{item.name}</p>
                                                <p className="text-xs text-slate-500">Qty: {item.stock}</p>
                                            </div>
                                            <p className="font-semibold text-sm">${(item.price * item.stock).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                                 {sale.returnInfo?.status === 'requested' && (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-4">
                                        <h4 className="font-bold text-yellow-800">Return Requested</h4>
                                        <p className="text-sm text-yellow-700 mt-1"><b>Reason:</b> {sale.returnInfo.reason}</p>
                                        <div className="flex gap-2 mt-3">
                                            <button onClick={() => handleProcessReturn(sale.orderId, 'approved')} className="bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-md hover:bg-green-600">Approve Refund</button>
                                            <button onClick={() => handleProcessReturn(sale.orderId, 'rejected')} className="bg-red-500 text-white px-3 py-1 text-xs font-semibold rounded-md hover:bg-red-600">Reject Return</button>
                                        </div>
                                    </div>
                                 )}
                                 <form onSubmit={(e) => handleUpdateSale(e, sale.orderId)}>
                                    <div className="grid md:grid-cols-3 gap-4 items-end bg-slate-50 p-4 rounded-lg">
                                        <div>
                                            <label className="block text-xs font-semibold mb-1.5">Order Status</label>
                                            <select name="status" defaultValue={sale.status} className="w-full px-3 py-2 text-sm border rounded-lg focus:border-blue-500 focus:outline-none bg-white">
                                                <option>Processing</option>
                                                <option>Shipped</option>
                                                <option>Delivered</option>
                                                <option disabled>Return Requested</option>
                                                <option disabled>Refunded</option>
                                                <option disabled>Completed</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold mb-1.5">Postal Service</label>
                                            <select name="service" defaultValue={sale.shippingInfo?.service} className="w-full px-3 py-2 text-sm border rounded-lg focus:border-blue-500 focus:outline-none bg-white">
                                                <option value="">Select...</option>
                                                <option>USPS</option>
                                                <option>FedEx</option>
                                                <option>UPS</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold mb-1.5">Schedule Pickup</label>
                                            <input name="appointment" type="datetime-local" defaultValue={sale.shippingInfo?.appointment} className="w-full px-3 py-2 text-sm border rounded-lg focus:border-blue-500 focus:outline-none bg-white" />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full mt-4 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition">Update Order</button>
                                 </form>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl p-12 text-center border">
                        <Package className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                        <p className="text-lg text-slate-600">You have no sales yet.</p>
                    </div>
                )}
            </div>
        )}
        {/* Other views and modals will be added here */}
      </main>
    </div>
    </>
  );
}