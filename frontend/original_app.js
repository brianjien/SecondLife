import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, LogOut, Plus, Search, Heart, Package, CreditCard, X, Check, Wallet, ArrowLeft, Lock, ChevronLeft, ChevronRight, UploadCloud, Tag, ChevronDown, Edit, Bell, Send, CornerDownLeft, MessageSquare, Shield, Settings, Star, Camera, QrCode, HelpCircle } from 'lucide-react';
import { io } from "socket.io-client";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, email: 'demo@example.com', password: 'demo123', name: 'Demo User', isAdmin: true, balance: 100, cards: [{id: 12345, cardNumber: '1111222233334444', cardName: 'Demo User', expiryDate: '12/28', cvv: '123', lastFour: '4444'}], address: '123 Main St, Anytown, USA', phone: '+1-555-555-5555', purchaseHistory: [], sales: [], coupons: [{ id: 'welcome10', name: '$10 Welcome Offer', type: 'fixed', value: 10, used: false, minPurchase: 0, category: 'All' }], profilePicture: null, reviews: [] },
    { id: 2, email: 'jane@example.com', password: 'password', name: 'Jane Doe', isAdmin: false, balance: 50, cards: [], address: '456 Oak Ave, Sometown, USA', phone: '+1-555-123-4567', purchaseHistory: [], sales: [], coupons: [], profilePicture: null, reviews: [{ by: 'Demo User', rating: 5, comment: 'Great seller, fast shipping!', photo: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100'}] },
    { id: 3, email: 'support@secondlife.com', password: 'supportpassword', name: 'Support Team', isAdmin: false, isService: true, balance: 0, cards: [], address: '100 Help Ave, Webville', phone: '+1-800-SUPPORT', purchaseHistory: [], sales: [], coupons: [], profilePicture: null, reviews: []}
  ]);
  const [products, setProducts] = useState([
    { id: 1, name: 'Leather Jacket', price: 89.99, stock: 1, discount: 15, imageUrls: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 'https://images.unsplash.com/photo-1611312449412-6cefac5dc2b4?w=400'], desc: 'Classic brown leather jacket, perfect for all seasons. Minimal wear.', sellerId: 2, cat: 'Fashion', cond: 'Good', status: 'available', questions: [] },
    { id: 2, name: 'iPhone 12', price: 499.99, stock: 3, discount: 0, imageUrls: ['https://images.unsplash.com/photo-1607936854259-c2a2c9121600?w=400'], desc: 'Unlocked 128GB model in midnight blue. Comes with original box. Screen is flawless.', sellerId: 2, cat: 'Electronics', cond: 'Excellent', status: 'available', questions: [] },
    { id: 3, name: 'Vintage Camera', price: 150, stock: 1, discount: 10, imageUrls: ['https://images.unsplash.com/photo-1519638831568-d9897f54ed69?w=400', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', 'https://images.unsplash.com/photo-1505739998589-00fc19123124?w=400'], desc: 'A classic 35mm film camera for the photography enthusiast. Fully functional.', sellerId: 1, cat: 'Electronics', cond: 'Good', status: 'available', questions: [] },
    { id: 4, name: 'Designer Handbag', price: 299.99, stock: 2, discount: 0, imageUrls: ['https://images.unsplash.com/photo-1590737053053-6a68b584c1d5?w=400'], desc: 'Luxury leather handbag with gold-plated hardware. A timeless piece.', sellerId: 2, cat: 'Fashion', cond: 'Very Good', status: 'available', questions: [] },
    { id: 5, name: 'Gaming Console', price: 199.99, stock: 1, discount: 0, imageUrls: ['https://images.unsplash.com/photo-1550745165-9bc0b252726a?w=400'], desc: 'PS4 bundle with two controllers and three popular games included.', sellerId: 1, cat: 'Electronics', cond: 'Good', status: 'available', questions: [] },
    { id: 6, name: 'Acoustic Guitar', price: 249.99, stock: 1, discount: 20, imageUrls: ['https://images.unsplash.com/photo-1510915361894-db8b60106945?w=400'], desc: 'Full-size dreadnought guitar with a warm, rich tone. Great for beginners.', sellerId: 1, cat: 'Music', cond: 'Very Good', status: 'available', questions: [] },
    { id: 7, name: 'Classic Watch', price: 180.00, stock: 8, discount: 0, imageUrls: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400'], desc: 'Elegant wristwatch with a leather strap. A timeless accessory.', sellerId: 2, cat: 'Fashion', cond: 'Excellent', status: 'available', questions: [] },
    { id: 8, name: 'Running Shoes', price: 75.50, stock: 1, discount: 5, imageUrls: ['https://images.unsplash.com/photo-1542291026-7eec264c27ab?w=400'], desc: 'Lightweight and comfortable running shoes for your daily jog.', sellerId: 1, cat: 'Fashion', cond: 'Very Good', status: 'available', questions: [] },
    { id: 9, name: 'Modern Laptop', price: 950.00, stock: 4, discount: 0, imageUrls: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'], desc: 'High-performance laptop suitable for work and gaming.', sellerId: 2, cat: 'Electronics', cond: 'Excellent', status: 'available', questions: [] },
    { id: 10, name: 'Fantasy Novel', price: 15.99, stock: 12, discount: 0, imageUrls: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'], desc: 'A captivating fantasy novel that will transport you to another world.', sellerId: 1, cat: 'Books', cond: 'Good', status: 'available', questions: [] },
    { id: 11, name: 'Smart Thermostat', price: 129.99, stock: 1, discount: 10, imageUrls: ['https://images.unsplash.com/photo-1617103996207-01d78c0c0d8b?w=400'], desc: 'Energy-saving smart thermostat that learns your schedule.', sellerId: 2, cat: 'Home Goods', cond: 'Excellent', status: 'available', questions: [] },
    { id: 12, name: 'Yoga Mat', price: 39.99, stock: 1, discount: 0, imageUrls: ['https://images.unsplash.com/photo-1591291621265-b3a88a4ea853?w=400'], desc: 'Eco-friendly, non-slip yoga mat for your daily practice.', sellerId: 1, cat: 'Sports', cond: 'Very Good', status: 'available', questions: [] },
    { id: 13, name: 'Wooden Blocks Set', price: 25.00, stock: 15, discount: 0, imageUrls: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400'], desc: 'A set of colorful wooden blocks for creative play.', sellerId: 2, cat: 'Toys', cond: 'Good', status: 'available', questions: [] },
    { id: 14, name: 'Abstract Painting', price: 220.00, stock: 1, discount: 15, imageUrls: ['https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400'], desc: 'A beautiful abstract canvas to decorate your space.', sellerId: 1, cat: 'Art', cond: 'Excellent', status: 'available', questions: [] }
  ]);
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
  const [appState, setAppState] = useState(''); // 'logging-in', 'logging-out'
  const [showSuccessModal, setShowSuccessModal] = useState({show: false, message: '', subMessage: ''});
  const [adminView, setAdminView] = useState('users');
  const [messages, setMessages] = useState({});
  const [chatInput, setChatInput] = useState('');
  const chatMessagesRef = useRef(null);
  const [allCoupons, setAllCoupons] = useState([
    { id: 'SAVE20', code: 'SAVE20', value: 20, type: 'percentage', minPurchase: 50, category: 'All', createdBy: 'admin', quantity: 100, timesUsed: 5, usedBy: [2] },
    { id: '5OFF', code: '5OFF', value: 5, type: 'fixed', minPurchase: 0, category: 'All', createdBy: 'admin', quantity: 250, timesUsed: 88, usedBy: [] },
  ]);
  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'percentage', value: '', minPurchase: '', category: 'All', quantity: ''});
  const [ratingModal, setRatingModal] = useState({ isOpen: false, order: null, rating: 0, hoverRating: 0, comment: '', photo: null });
  const [newQuestion, setNewQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [qrCodeModal, setQrCodeModal] = useState({ isOpen: false, orderId: null });

  // Effect for Socket.IO connection
  useEffect(() => {
    if (currentUser) {
      const newSocket = io('http://localhost:4000');
      setSocket(newSocket);
      newSocket.on('connect', () => { newSocket.emit('register_user', currentUser.id); });

      const handleNotification = (data, type) => setNotifications(prev => [{...data, id: Date.now(), read: false, type}, ...prev]);

      newSocket.on('order_notification', (saleInfo) => {
        handleNotification(saleInfo, 'sale');
        setUsers(prevUsers => prevUsers.map(u => u.id === saleInfo.sellerId ? {...u, sales: [saleInfo, ...u.sales]} : u));
      });

      newSocket.on('status_updated', (updatedOrder) => {
        handleNotification(updatedOrder, 'status_update');
        const updatedState = (user) => ({...user, purchaseHistory: user.purchaseHistory.map(o => o.orderId === updatedOrder.orderId ? updatedOrder : o)});
        if(currentUser.id === updatedOrder.buyerId) setCurrentUser(updatedState);
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedOrder.buyerId ? updatedState(u) : u));
      });

      newSocket.on('new_return_request', (requestInfo) => {
        handleNotification(requestInfo, 'return_request');
        const updatedState = (user) => ({...user, sales: user.sales.map(s => s.orderId === requestInfo.orderId ? {...s, status: 'Return Requested', returnInfo: {status: 'requested', reason: requestInfo.reason}} : s)});
        if(currentUser.id === requestInfo.sellerId) setCurrentUser(updatedState);
        setUsers(prevUsers => prevUsers.map(u => u.id === requestInfo.sellerId ? updatedState(u) : u));
      });
      
      newSocket.on('your_return_updated', (updateInfo) => {
        handleNotification(updateInfo, 'return_update');
        const updatedState = (user) => ({...user, purchaseHistory: user.purchaseHistory.map(o => o.orderId === updateInfo.orderId ? {...o, status: updateInfo.newStatus, returnInfo: {...o.returnInfo, status: updateInfo.decision}} : o)});
        if(currentUser.id === updateInfo.buyerId) setCurrentUser(updatedState);
        setUsers(prevUsers => prevUsers.map(u => u.id === updateInfo.buyerId ? updatedState(u) : u));
      });

      newSocket.on('return_was_canceled', (cancelInfo) => {
          handleNotification(cancelInfo, 'return_cancel');
          const updatedState = (user) => ({...user, sales: user.sales.map(s => s.orderId === cancelInfo.orderId ? {...s, status: 'Delivered', returnInfo: {status: 'canceled', reason: ''}} : s)});
          if(currentUser.id === cancelInfo.sellerId) setCurrentUser(updatedState);
          setUsers(prevUsers => prevUsers.map(u => u.id === cancelInfo.sellerId ? updatedState(u) : u));
      });

      newSocket.on('receive_private_message', ({ senderId, text, self }) => {
          const chatPartnerId = self ? 3 : senderId; // 3 is support ID
          setMessages(prev => ({
              ...prev,
              [chatPartnerId]: [...(prev[chatPartnerId] || []), { senderId, text }]
          }));
      });

      return () => newSocket.disconnect();
    } else if (socket) {
        socket.disconnect();
        setSocket(null);
    }
  }, [currentUser]);

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
  
  useEffect(() => () => products.forEach(p => p.imageUrls.forEach(url => { if (url.startsWith('blob:')) URL.revokeObjectURL(url); })), [products]);
  
  useEffect(() => {
    if (view !== 'cart') {
      setAppliedDiscount(null);
      setDiscountCodeInput('');
      setDiscountError('');
    }
  }, [view]);

  useEffect(() => {
    if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

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
  const listerProducts = listerProfile ? products.filter(p => p.sellerId === listerProfile.id && p.status === 'available') : [];
  const userCards = currentUser ? users.find(u => u.id === currentUser.id)?.cards || [] : [];
  
  const availableCouponsForUser = currentUser ? [
      ...allCoupons.filter(c => c.quantity > c.timesUsed && !c.usedBy.includes(currentUser.id)),
      ...currentUser.coupons.filter(c => !c.used)
  ] : [];

  const validateAuthForm = () => {
    const errors = {};
    if (!authForm.email.includes('@')) errors.email = "Invalid email address.";
    if (authForm.password.length < 6) errors.password = "Password must be at least 6 characters.";
    if (authMode === 'signup') {
        if (!authForm.name) errors.name = "Name is required.";
        if (!authForm.address) errors.address = "Address is required.";
        if (!authForm.phone) errors.phone = "Phone number is required.";
    }
    setAuthErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateNewProdForm = (product) => {
      const p = product || newProd;
      const errors = {};
      if (!p.name) errors.name = "Name is required.";
      if (!p.price || isNaN(p.price) || p.price <= 0) errors.price = "Valid price is required.";
      if (!p.stock || isNaN(p.stock) || p.stock < 1) errors.stock = "Stock must be at least 1.";
      if (p.imageUrls.length === 0) errors.imageUrls = "Please upload at least one image.";
      const discountVal = parseInt(p.discount, 10);
      if (isNaN(discountVal) || discountVal < 0 || discountVal > 99) errors.discount = "Discount must be between 0 and 99."
      return errors;
  };

  const handleAuth = () => {
    if (!validateAuthForm()) return;
    if (authMode === 'login') {
      const user = users.find(u => u.email === authForm.email && u.password === authForm.password);
      if (user) { 
        setAppState('logging-in');
        setTimeout(() => {
          setCurrentUser(user); 
          setAuthModal(false); 
          setAuthForm({ email: '', password: '', name: '', address: '', phone: '' });
          setAppState('');
        }, 1500);
      } else { 
        setAuthErrors({ general: 'Invalid credentials! Try demo@example.com / demo123' }); 
      }
    } else {
      const newU = { id: users.length + 1, ...authForm, phone: `${countryCode}-${authForm.phone}`, balance: 0, cards: [], purchaseHistory: [], sales: [], coupons: [{ id: `welcome-${Date.now()}`, name: '$10 Welcome Offer', type: 'fixed', value: 10, used: false, minPurchase: 0, category: 'All' }], profilePicture: null, reviews: [] };
      setUsers([...users, newU]);
      setAppState('logging-in');
      setTimeout(() => {
        setCurrentUser(newU);
        setAuthModal(false);
        setAuthForm({ email: '', password: '', name: '', address: '', phone: '' });
        setAppState('');
      }, 1500);
    }
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

  const handleAddCard = () => {
    if (!currentUser) return;
    const newC = { id: Date.now(), ...cardForm, lastFour: cardForm.cardNumber.slice(-4) };
    const updatedUsers = users.map(u => u.id === currentUser.id ? { ...u, cards: [...u.cards, newC] } : u);
    setUsers(updatedUsers);
    setCurrentUser(updatedUsers.find(u => u.id === currentUser.id));
    setCardForm({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });
    setAddCard(false);
    setCardAdded(true);
    setTimeout(() => setCardAdded(false), 2500);
  };
  
  const handleCredit = () => {
    if (!selCard || !credit || parseFloat(credit) <= 0) return alert('Please select a card and enter a valid amount.');
    const amt = parseFloat(credit);
    const updatedUsers = users.map(u => u.id === currentUser.id ? { ...u, balance: u.balance + amt } : u);
    setUsers(updatedUsers);
    setCurrentUser(updatedUsers.find(u => u.id === currentUser.id));
    setCredit(''); setSelCard(null); setAddCredit(false);
  };

  const addToCart = (p) => {
    if (!currentUser) return setAuthModal(true);
    if(p.stock <= 0) return alert("Out of stock!");
    const itemInCart = cart.find(i => i.id === p.id);
    if (itemInCart) {
      if (itemInCart.quantity < p.stock) updateQty(p.id, 1);
      else alert("No more items in stock!");
    } else {
      setCart([...cart, { ...p, quantity: 1 }]);
    }
  };
  
  const updateQty = (id, change) => {
    const itemInCart = cart.find(i => i.id === id);
    const product = products.find(p => p.id === id);
    if (!itemInCart || !product) return;
    
    const newQuantity = itemInCart.quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setCart(cart.map(i => i.id === id ? { ...i, quantity: newQuantity } : i));
    } else if (newQuantity < 1) {
      removeCart(id);
    }
  };
  
  const removeCart = (id) => setCart(cart.filter(i => i.id !== id));
  
  const toggleFav = (id) => { if (!currentUser) return setAuthModal(true); setFav(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]); };

  const handleImageUpload = (e, targetProduct) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    if(targetProduct === 'new') setNewProd(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...imageUrls] }));
    else setEditingProduct(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...imageUrls] }));
  };

  const handleAddProd = () => {
    const errors = validateNewProdForm();
    if (Object.keys(errors).length > 0) { setNewProdErrors(errors); return; }
    const p = { id: products.length + 1, ...newProd, price: parseFloat(newProd.price), stock: parseInt(newProd.stock, 10), discount: parseInt(newProd.discount, 10) || 0, sellerId: currentUser.id, status: 'available', questions: [] };
    setProducts([...products, p]);
    setNewProd({ name: '', price: '', desc: '', cat: 'Fashion', cond: 'Good', imageUrls: [], discount: 0, stock: 1 });
    setView('myListings');
  };

  const handleUpdateProduct = () => {
    const errors = validateNewProdForm(editingProduct);
    if (Object.keys(errors).length > 0) { setNewProdErrors(errors); return; }
    if (!editingProduct) return;
    setProducts(products.map(p => p.id === editingProduct.id ? { ...editingProduct, price: parseFloat(editingProduct.price), stock: parseInt(editingProduct.stock, 10), discount: parseInt(editingProduct.discount, 10) || 0 } : p));
    setEditingProduct(null);
  };

  const handleUpdateSale = (saleId, newStatus, shippingInfo) => {
    let buyerId;
    const updatedUsers = users.map(user => {
        let tempUser = {...user};
        if(tempUser.id === currentUser.id) {
            tempUser.sales = tempUser.sales.map(sale => {
                if(sale.orderId === saleId) {
                    buyerId = sale.buyerId;
                    return {...sale, status: newStatus, shippingInfo};
                }
                return sale;
            });
        }
        return tempUser;
    }).map(user => { 
        if (buyerId && user.id === buyerId) {
            return { ...user, purchaseHistory: user.purchaseHistory.map(order => order.orderId === saleId ? {...order, status: newStatus, shippingInfo} : order) };
        }
        return user;
    });

    setUsers(updatedUsers);
    setCurrentUser(updatedUsers.find(u => u.id === currentUser.id));
    
    if (socket && buyerId) {
        const updatedOrder = updatedUsers.find(u => u.id === buyerId).purchaseHistory.find(o => o.orderId === saleId);
        socket.emit('status_update_to_buyer', { buyerId, updatedOrder });
    }
  };

  const handleRequestReturn = (orderId, reason) => {
    let sellerId;
    const updatedUsers = users.map(user => {
        if(user.id === currentUser.id) { // Buyer
            return { ...user, purchaseHistory: user.purchaseHistory.map(o => {
                    if (o.orderId === orderId) {
                        sellerId = o.items[0].sellerId;
                        return {...o, status: 'Return Requested', returnInfo: {status: 'requested', reason}};
                    }
                    return o;
                })
            };
        }
        return user;
    }).map(user => { // Seller
        if(sellerId && user.id === sellerId) {
            return { ...user, sales: user.sales.map(s => s.orderId === orderId ? {...s, status: 'Return Requested', returnInfo: {status: 'requested', reason}} : s) }
        }
        return user;
    });

    setUsers(updatedUsers);
    setCurrentUser(updatedUsers.find(u => u.id === currentUser.id));
    setReturnRequest({isOpen: false, order: null, reason: ''});
    setShowSuccessModal({show: true, message: 'Return Request Submitted!', subMessage: 'The seller has been notified.'});
    setTimeout(() => setShowSuccessModal({show: false, message: ''}), 2500);

    if(socket && sellerId) socket.emit('return_request_to_seller', {orderId, sellerId, reason, buyerName: currentUser.name});
  };

  const handleCancelReturnRequest = (orderId) => {
    let sellerId;
    const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) { // Buyer
            return { ...user, purchaseHistory: user.purchaseHistory.map(o => {
                    if (o.orderId === orderId) {
                        sellerId = o.items[0].sellerId;
                        return {...o, status: 'Delivered', returnInfo: { status: 'canceled', reason: '' }};
                    }
                    return o;
                })
            };
        }
        return user;
    }).map(user => { // Seller
        if (sellerId && user.id === sellerId) {
            return {...user, sales: user.sales.map(s => s.orderId === orderId ? {...s, status: 'Delivered', returnInfo: { status: 'canceled', reason: '' }} : s)};
        }
        return user;
    });

    setUsers(updatedUsers);
    setCurrentUser(updatedUsers.find(u => u.id === currentUser.id));
    setReturnRequest({ isOpen: false, order: null, reason: '' });

    if (socket && sellerId) socket.emit('cancel_return_to_seller', { orderId, sellerId, buyerName: currentUser.name });
  };


  const handleProcessReturn = (sale, decision) => {
    const { orderId, buyerId, items, total } = sale;
    const newStatus = decision === 'approved' ? 'Refunded' : 'Delivered';
    const newReturnStatus = decision === 'approved' ? 'approved' : 'rejected';
    
    let updatedUsers = [...users];
    let updatedProducts = [...products];

    const sellerIndex = updatedUsers.findIndex(u => u.id === currentUser.id);
    if(sellerIndex > -1) {
        updatedUsers[sellerIndex].sales = updatedUsers[sellerIndex].sales.map(s => s.orderId === orderId ? {...s, status: newStatus, returnInfo: {...s.returnInfo, status: newReturnStatus}} : s);
        if(decision === 'approved') updatedUsers[sellerIndex].balance -= total;
    }

    const buyerIndex = updatedUsers.findIndex(u => u.id === buyerId);
    if(buyerIndex > -1) {
        updatedUsers[buyerIndex].purchaseHistory = updatedUsers[buyerIndex].purchaseHistory.map(o => o.orderId === orderId ? {...o, status: newStatus, returnInfo: {...o.returnInfo, status: newReturnStatus}} : o);
        if(decision === 'approved') updatedUsers[buyerIndex].balance += total;
    }
    
    if(decision === 'approved') {
        items.forEach(item => {
            const productIndex = updatedProducts.findIndex(p => p.id === item.id);
            if(productIndex > -1) {
                updatedProducts[productIndex].stock += item.quantity;
                updatedProducts[productIndex].status = 'available';
            }
        });
    }
    
    setUsers(updatedUsers);
    setProducts(updatedProducts);
    setCurrentUser(updatedUsers.find(u => u.id === currentUser.id));

    if(socket) socket.emit('return_status_to_buyer', {orderId, buyerId, newStatus, decision: newReturnStatus});
  };
  
  const handleCheckout = () => {
    const finalTotal = calculateFinalTotal();
    let paymentMethodInfo = {};
    let updatedUsers = [...users];

    if (selectedPaymentMethod === 'wallet') {
        if (currentUser.balance < finalTotal) {
            alert('Insufficient balance in your wallet!');
            setCheckout(false);
            setView('profile');
            return;
        }
        paymentMethodInfo = { type: 'wallet', details: 'Paid from Wallet Balance' };
        const buyerIndex = updatedUsers.findIndex(u => u.id === currentUser.id);
        if(buyerIndex > -1) updatedUsers[buyerIndex].balance -= finalTotal;

    } else if (selectedPaymentMethod === 'face-to-face') {
        paymentMethodInfo = { type: 'face-to-face', details: 'Pay on Pickup' };
    } else {
        const card = userCards.find(c => c.id === selectedPaymentMethod);
        if (!card) {
            alert('Invalid card selected.');
            return;
        }
        paymentMethodInfo = { type: 'card', details: `Paid with card •••• ${card.lastFour}` };
    }

    let updatedProducts = [...products];
    const orderId = `SL-${Date.now()}`;

    const newOrderForBuyer = {
        orderId, buyerId: currentUser.id, date: new Date().toISOString(), total: finalTotal, items: cart,
        shippingAddress: currentUser.address, status: 'Processing', shippingInfo: null, paymentMethod: paymentMethodInfo,
        returnInfo: { status: 'none', reason: '' }, rated: false
    };
    
    const itemsBySeller = cart.reduce((acc, item) => {
        acc[item.sellerId] = acc[item.sellerId] || [];
        acc[item.sellerId].push(item);
        return acc;
    }, {});

    const buyerIndex = updatedUsers.findIndex(u => u.id === currentUser.id);
    if (buyerIndex !== -1) {
      updatedUsers[buyerIndex].purchaseHistory = [newOrderForBuyer, ...updatedUsers[buyerIndex].purchaseHistory];
    }
    
    if (appliedDiscount) {
        if (appliedDiscount.createdBy === 'admin') {
            const updatedAllCoupons = allCoupons.map(c => 
                c.id === appliedDiscount.id 
                ? { ...c, timesUsed: c.timesUsed + 1, usedBy: [...c.usedBy, currentUser.id] } 
                : c
            );
            setAllCoupons(updatedAllCoupons);
        } else { // It's a user coupon
            if (buyerIndex > -1) {
                updatedUsers[buyerIndex].coupons = updatedUsers[buyerIndex].coupons.map(c => 
                    c.id === appliedDiscount.id ? { ...c, used: true } : c
                );
            }
        }
    }

    for (const sellerId in itemsBySeller) {
        const sellerItems = itemsBySeller[sellerId];
        const sellerTotal = sellerItems.reduce((sum, item) => sum + calculateDiscountedPrice(item.price, item.discount) * item.quantity, 0);
        const sellerBonus = sellerTotal * 0.05;
        const sellerPayout = sellerTotal + sellerBonus;
        
        const saleRecord = {
            orderId, sellerId: parseInt(sellerId), buyerId: currentUser.id, buyerName: currentUser.name,
            buyerAddress: currentUser.address, date: newOrderForBuyer.date, items: sellerItems, total: sellerTotal,
            status: 'Processing', shippingInfo: null, paymentMethod: paymentMethodInfo,
            returnInfo: { status: 'none', reason: '' }
        };

        const sellerIndex = updatedUsers.findIndex(u => u.id === parseInt(sellerId));
        if (sellerIndex !== -1) {
            if (paymentMethodInfo.type !== 'face-to-face') {
                updatedUsers[sellerIndex].balance += sellerPayout;
            }
            updatedUsers[sellerIndex].sales = [saleRecord, ...updatedUsers[sellerIndex].sales];
        }
        
        if (socket) socket.emit('new_order_to_seller', saleRecord);
    }

    cart.forEach(item => {
        const productIndex = updatedProducts.findIndex(p => p.id === item.id);
        if (productIndex !== -1) {
            const newStock = updatedProducts[productIndex].stock - item.quantity;
            updatedProducts[productIndex] = { ...updatedProducts[productIndex], stock: newStock, status: newStock <= 0 ? 'sold' : 'available' };
        }
    });

    setUsers(updatedUsers);
    setProducts(updatedProducts);
    setCurrentUser(updatedUsers.find(u => u.id === currentUser.id));
    setCart([]);
    setAppliedDiscount(null);
    setLastOrder(newOrderForBuyer);
    setCheckout(false);
    setView('orderStatus');
  };

  const handleAdminUpdateBalance = (userId, newBalance) => {
      const bal = parseFloat(newBalance);
      if(isNaN(bal)) return;
      setUsers(users.map(u => u.id === userId ? {...u, balance: bal} : u));
  };
  
  const handleSendMessage = () => {
    if(!chatInput.trim() || !currentUser) return;
    socket.emit('send_private_message', {
        recipientId: 3, // Support ID
        senderId: currentUser.id,
        text: chatInput,
    });
    setChatInput('');
  };

  const handleCreateCoupon = (e) => {
      e.preventDefault();
      if (!newCoupon.code || !newCoupon.value || !newCoupon.quantity) {
          return alert("Code, Value, and Quantity are required.");
      }
      if (newCoupon.type === 'percentage' && (parseFloat(newCoupon.value) <= 0 || parseFloat(newCoupon.value) >= 100)) {
          return alert("Percentage value must be between 1 and 99.");
      }
      if (parseInt(newCoupon.quantity, 10) <= 0) {
          return alert("Quantity must be a positive number.");
      }

      const newC = {
          id: `${newCoupon.code.toUpperCase()}-${Date.now()}`,
          createdBy: 'admin',
          ...newCoupon,
          code: newCoupon.code.toUpperCase(),
          value: parseFloat(newCoupon.value),
          minPurchase: parseFloat(newCoupon.minPurchase || 0),
          quantity: parseInt(newCoupon.quantity, 10),
          timesUsed: 0,
          usedBy: []
      };
      
      setAllCoupons(prev => [...prev, newC]);
      setNewCoupon({ code: '', type: 'percentage', value: '', minPurchase: '', category: 'All', quantity: '' });
  };

  const handleProfilePictureChange = (e) => {
      if(e.target.files && e.target.files[0]) {
          const imgUrl = URL.createObjectURL(e.target.files[0]);
          const updatedUsers = users.map(u => u.id === currentUser.id ? {...u, profilePicture: imgUrl} : u);
          setUsers(updatedUsers);
          setCurrentUser(prev => ({...prev, profilePicture: imgUrl}));
      }
  };

  const handlePostReview = () => {
      const { order, rating, comment, photo } = ratingModal;
      if(rating === 0) return alert('Please select a rating.');

      const sellerId = order.items[0].sellerId;
      const review = {
          by: currentUser.name,
          byUserId: currentUser.id,
          rating,
          comment,
          photo,
          date: new Date().toISOString()
      };
      
      const updatedUsers = users.map(u => {
          if(u.id === sellerId) return {...u, reviews: [review, ...(u.reviews || [])]};
          if(u.id === currentUser.id) return {...u, purchaseHistory: u.purchaseHistory.map(o => o.orderId === order.orderId ? {...o, rated: true} : o)};
          return u;
      });
      
      setUsers(updatedUsers);
      setCurrentUser(prev => ({...prev, purchaseHistory: prev.purchaseHistory.map(o => o.orderId === order.orderId ? {...o, rated: true} : o)}));
      setRatingModal({ isOpen: false, order: null, rating: 0, hoverRating: 0, comment: '', photo: null });
  };

  const handleAskQuestion = (productId) => {
    if (!newQuestion.trim()) return;
    const question = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        text: newQuestion,
        answer: null,
        date: new Date().toISOString()
    };
    setProducts(products.map(p => p.id === productId ? {...p, questions: [...(p.questions || []), question]} : p));
    setNewQuestion('');
  };

  const handleAnswerQuestion = (productId, questionId) => {
    if (!answer.trim()) return;
    setProducts(products.map(p => 
        p.id === productId 
        ? {...p, questions: p.questions.map(q => q.id === questionId ? {...q, answer} : q)}
        : p
    ));
    setAnswer('');
  };

  const handleScanQRCode = (orderId) => {
    // Simulate scanning
    setShowSuccessModal({show: true, message: 'QR Code Scanned!', subMessage: 'Order marked as complete.'});
    setTimeout(() => setShowSuccessModal({show: false, message: ''}), 2500);

    let buyerId;
    const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) { // This is the seller
            return { ...user, sales: user.sales.map(s => {
                if (s.orderId === orderId) {
                    buyerId = s.buyerId;
                    return {...s, status: 'Completed'};
                }
                return s;
            })};
        }
        return user;
    }).map(user => {
        if (buyerId && user.id === buyerId) {
            return { ...user, purchaseHistory: user.purchaseHistory.map(o => o.orderId === orderId ? {...o, status: 'Completed'} : o)};
        }
        return user;
    });

    setUsers(updatedUsers);
    setCurrentUser(updatedUsers.find(u => u.id === currentUser.id));
    setQrCodeModal({ isOpen: false, orderId: null });

    if (socket && buyerId) {
        const updatedOrder = updatedUsers.find(u => u.id === buyerId).purchaseHistory.find(o => o.orderId === orderId);
        socket.emit('status_update_to_buyer', { buyerId, updatedOrder });
    }
  };

  const handleCollectCoupon = (couponId) => {
    if (!currentUser) {
        setAuthModal(true);
        return;
    }
    const coupon = allCoupons.find(c => c.id === couponId);
    if (coupon && !currentUser.coupons.some(c => c.id === couponId) && !coupon.usedBy.includes(currentUser.id)) {
        const updatedUsers = users.map(u => 
            u.id === currentUser.id 
            ? {...u, coupons: [...u.coupons, {...coupon, used: false}]}
            : u
        );
        setUsers(updatedUsers);
        setCurrentUser(updatedUsers.find(u => u.id === currentUser.id));
        setShowSuccessModal({show: true, message: 'Coupon Collected!', subMessage: 'It has been added to your profile.'});
        setTimeout(() => setShowSuccessModal({show: false, message: ''}), 2500);
    } else {
        alert('You have already collected this coupon.');
    }
  };

  const handleProductClick = (product) => { setSelectedProduct(product); setImageCarouselIndex(0); };
  const handleViewLister = (sellerId) => { const seller = users.find(u => u.id === sellerId); if (seller) { setListerProfile(seller); setView('listerProfile'); } };
  const closeProductModal = () => setSelectedProduct(null);

  const changeCarouselImage = (direction) => {
      if (!selectedProduct) return;
      const newIndex = imageCarouselIndex + direction;
      const totalImages = selectedProduct.imageUrls.length;
      if (newIndex < 0) setImageCarouselIndex(totalImages - 1);
      else if (newIndex >= totalImages) setImageCarouselIndex(0);
      else setImageCarouselIndex(newIndex);
  };
  
  const applyDiscountCode = () => {
    const code = discountCodeInput.toUpperCase();
    const subtotal = cart.reduce((s, i) => s + (calculateDiscountedPrice(i.price, i.discount) * i.quantity), 0);
    
    const allAvailableCoupons = [...allCoupons, ...(currentUser?.coupons || [])];
    const foundCoupon = allAvailableCoupons.find(c => c.code === code);

    if (foundCoupon) {
        if (foundCoupon.createdBy === 'admin') {
            if (foundCoupon.timesUsed >= foundCoupon.quantity) {
                setDiscountError('This discount code has reached its usage limit.');
                return;
            }
            if (foundCoupon.usedBy?.includes(currentUser.id)) {
                setDiscountError('You have already used this coupon code.');
                return;
            }
        } else { // It's a user coupon
            if (foundCoupon.used) {
                setDiscountError('This coupon has already been used.');
                return;
            }
        }
    
        if(subtotal < foundCoupon.minPurchase) {
            setDiscountError(`A minimum purchase of $${foundCoupon.minPurchase} is required.`);
            return;
        }
        if(foundCoupon.category !== 'All' && !cart.some(item => item.cat === foundCoupon.category)) {
            setDiscountError(`This code is only valid for items in the ${foundCoupon.category} category.`);
            return;
        }
      setAppliedDiscount(foundCoupon);
      setDiscountError('');
    } else {
      setDiscountError('Invalid or expired discount code.');
    }
  };

  const calculateFinalTotal = () => {
    const subtotal = cart.reduce((s, i) => s + (calculateDiscountedPrice(i.price, i.discount) * i.quantity), 0);
    if (!appliedDiscount) return subtotal;
    if (appliedDiscount.type === 'fixed') {
      return Math.max(0, subtotal - appliedDiscount.value);
    }
    if (appliedDiscount.type === 'percentage') {
      return subtotal * (1 - appliedDiscount.value / 100);
    }
    return subtotal;
  };

  const subtotal = cart.reduce((s, i) => s + (calculateDiscountedPrice(i.price, i.discount) * i.quantity), 0);
  const finalTotal = calculateFinalTotal();
  const getSeller = (id) => users.find(u => u.id === id);
  const allOrders = users.flatMap(u => u.purchaseHistory).sort((a,b) => new Date(b.date) - new Date(a.date));

  const getNotificationMessage = (n) => {
    switch (n.type) {
        case 'sale': return `🎉 New Sale! You sold ${n.items.map(item => item.name).join(', ')}.`;
        case 'status_update': return `🚚 Order ${n.orderId} is now ${n.status}.`;
        case 'return_request': return `⚠️ Return requested for order ${n.orderId} by ${n.buyerName}.`;
        case 'return_update': return `✅ Return for order ${n.orderId} was ${n.decision}.`;
        case 'return_cancel': return `ℹ️ ${n.buyerName} canceled the return request for ${n.orderId}.`
        default: return 'You have a new notification.';
    }
  };
  const averageRating = listerProfile ? (listerProfile.reviews.reduce((acc, r) => acc + r.rating, 0) / listerProfile.reviews.length) : 0;


  return (
    <>
    <style>{`
      .checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 2; stroke-miterlimit: 10; stroke: #7ac142; fill: none; animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
      .checkmark { width: 56px; height: 56px; border-radius: 50%; display: block; stroke-width: 2; stroke: #fff; stroke-miterlimit: 10; margin: 10% auto; box-shadow: inset 0px 0px 0px #7ac142; animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both; }
      .checkmark__check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
      @keyframes stroke { 100% { stroke-dashoffset: 0; } }
      @keyframes scale { 0%, 100% { transform: none; } 50% { transform: scale3d(1.1, 1.1, 1); } }
      @keyframes fill { 100% { box-shadow: inset 0px 0px 0px 30px #7ac142; } }
      @keyframes modal-enter { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
      .animate-modal-enter { animation: modal-enter 0.2s ease-out forwards; }
      @keyframes fade-out-profile { 0% { transform: scale(1) translateY(0); opacity: 1; } 100% { transform: scale(0) translateY(-200px); opacity: 0; } }
      .animate-fade-out-profile { transform-origin: top right; animation: fade-out-profile 0.5s ease-in forwards; }
    `}</style>
    <div className={`min-h-screen bg-slate-50 font-sans text-slate-800 transition-opacity duration-500`}>
      {!currentUser && !appState && <button onClick={() => setView('chat')} className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50"><MessageSquare/></button>}
      
      <header className="bg-white/80 backdrop-blur shadow-sm sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="cursor-pointer" onClick={() => { setView('home'); setListerProfile(null); }}>
                    <Logo />
                </div>
                <div className="relative hidden md:block" ref={categoryMenuRef}>
                    <button onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)} className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600">
                        Categories <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isCategoryMenuOpen && (
                        <div className="absolute top-full mt-2 w-56 bg-white rounded-lg shadow-lg border z-50 animate-modal-enter">
                        <ul className="py-1">
                            {cats.map(c => (
                            <li key={c}>
                                <button 
                                onClick={() => { setCat(c); setIsCategoryMenuOpen(false); setView('home'); }} 
                                className={`w-full text-left px-4 py-2 text-sm ${cat === c ? 'bg-blue-50 text-blue-600' : 'text-slate-700'} hover:bg-slate-100`}
                                >
                                {c}
                                </button>
                            </li>
                            ))}
                        </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1 max-w-xl hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="text" placeholder="Search for items..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentUser ? (
                <div className={`flex items-center gap-2 transition-all duration-500 ${appState === 'logging-out' ? 'animate-fade-out-profile' : ''}`}>
                  {currentUser.isAdmin && (
                    <button onClick={() => setView('admin')} className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition" title="Admin Panel"><Shield/></button>
                  )}
                  <div className="relative" ref={notifRef}>
                    <button onClick={() => setIsNotifOpen(prev => !prev)} className="relative p-2 hover:bg-slate-100 rounded-lg transition">
                        <Bell className="w-5 h-5 text-slate-700" />
                        {notifications.filter(n => !n.read).length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{notifications.filter(n => !n.read).length}</span>}
                    </button>
                    {isNotifOpen && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 animate-modal-enter">
                            <div className="p-3 border-b font-semibold text-sm">Notifications</div>
                            <ul className="py-1 max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? notifications.map((n) => (
                                    <li key={n.id} className="px-3 py-2 text-sm text-slate-600 border-b hover:bg-slate-50">{getNotificationMessage(n)}</li>
                                )) : <li className="px-3 py-4 text-sm text-center text-slate-500">No new notifications.</li>}
                            </ul>
                        </div>
                    )}
                  </div>
                  <button onClick={() => setView('sell')} className="hidden sm:flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition">
                    <Plus className="w-4 h-4" />Sell
                  </button>
                  <button onClick={() => setView('cart')} className="relative p-2 hover:bg-slate-100 rounded-lg transition">
                    <ShoppingCart className="w-5 h-5 text-slate-700" />
                    {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>}
                  </button>
                  <button onClick={() => setView('profile')} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition">
                    {currentUser.profilePicture ? <img src={currentUser.profilePicture} alt=" " className="w-6 h-6 rounded-full object-cover"/> : <User className="w-4 h-4" />}
                    <span className="text-sm font-medium hidden md:inline">{currentUser.name}</span>
                  </button>
                  <button onClick={handleLogout} className="p-2 hover:bg-slate-100 rounded-lg transition">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setAuthModal(true)} className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                  <User className="w-4 h-4" />Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {view === 'home' && (
          <>
            <div className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-white p-6 rounded-xl mb-6 flex items-center justify-between shadow-lg">
                <div>
                    <h2 className="text-2xl font-bold">Sell & Earn 5% Extra!</h2>
                    <p className="max-w-md text-sm opacity-90">List your items on SecondLife and get a 5% bonus credited to your account for every successful sale.</p>
                </div>
                <Wallet className="w-16 h-16 opacity-50 hidden sm:block" />
            </div>
            {/* Coupon Collection Section */}
            <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Available Coupons</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allCoupons.filter(c => c.quantity > c.timesUsed && (!currentUser || !currentUser.coupons.some(uc => uc.id === c.id)) && (!currentUser || !c.usedBy.includes(currentUser.id))).map(coupon => (
                        <div key={coupon.id} className="bg-white rounded-lg p-4 shadow-sm border flex justify-between items-center">
                            <div>
                                <p className="font-bold text-blue-600">{coupon.code}</p>
                                <p className="text-sm text-slate-600">{coupon.name}</p>
                            </div>
                            <button onClick={() => handleCollectCoupon(coupon.id)} className="bg-emerald-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-emerald-600">Collect</button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
              {cats.map(c => (
                <button key={c} onClick={() => setCat(c)} className={`px-4 py-1.5 rounded-full font-medium text-sm whitespace-nowrap transition ${cat === c ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}>{c}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filtered.map(p => {
                  const seller = getSeller(p.sellerId);
                  const discountedPrice = calculateDiscountedPrice(p.price, p.discount);
                  return (
                    <div key={p.id} onClick={() => handleProductClick(p)} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-100 flex flex-col cursor-pointer">
                      <div className="relative">
                        <img src={p.imageUrls[0]} alt={p.name} className="aspect-square w-full h-full object-cover rounded-t-xl" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/e2e8f0/64748b?text=Image' }} />
                        <div className="absolute top-2 left-0 right-0 px-2 flex justify-between items-start">
                            {p.discount > 0 ? (<span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">{p.discount}% OFF</span>) : <div />}
                            <button onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }} className="p-1.5 bg-white/90 rounded-full shadow-sm"><Heart className={`w-4 h-4 transition-all ${fav.includes(p.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} /></button>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                          <div className="bg-white/90 px-2 py-0.5 rounded-full text-xs font-medium">{p.cond}</div>
                          {p.stock === 1 && p.status === 'available' && (
                            <div className="bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full text-xs font-bold">Only 1 left!</div>
                          )}
                        </div>
                      </div>
                      <div className="p-3 flex-grow flex flex-col">
                        <h3 className="font-semibold text-sm mb-1 truncate">{p.name}</h3>
                        <p className="text-slate-600 text-xs mb-3 line-clamp-2 flex-grow">{p.desc}</p>
                        {seller && (
                            <button onClick={(e) => { e.stopPropagation(); handleViewLister(p.sellerId); }} className="flex items-center gap-2 mb-3 text-left hover:bg-slate-50 p-1 rounded-md transition-colors">
                                {seller.profilePicture ? <img src={seller.profilePicture} alt=" " className="w-6 h-6 rounded-full object-cover"/> : <div className="w-6 h-6 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{seller.name.charAt(0)}</div>}
                                <span className="text-xs font-semibold text-slate-600 truncate">{seller.name}</span>
                            </button>
                        )}
                        <div className="flex items-center justify-between mt-auto pt-2 border-t">
                            <div>
                              {p.discount > 0 ? (
                                <>
                                  <span className="text-lg font-bold text-red-600">${discountedPrice.toFixed(2)}</span>
                                  <span className="text-sm text-slate-400 line-through ml-2">${p.price.toFixed(2)}</span>
                                </>
                              ) : (
                                <span className="text-lg font-bold text-blue-600">${p.price.toFixed(2)}</span>
                              )}
                            </div>
                          <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition">Add</button>
                        </div>
                      </div>
                    </div>
                  )}
              )}
            </div>
          </>
        )}
        
        {view === 'listerProfile' && listerProfile && (
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => { setView('home'); setListerProfile(null); }} className="p-2 hover:bg-slate-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
                    <div className="flex items-center gap-3">
                        {listerProfile.profilePicture ? <img src={listerProfile.profilePicture} alt="" className="w-12 h-12 rounded-full object-cover"/> : <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">{listerProfile.name.charAt(0)}</div>}
                        <div>
                            <h2 className="text-2xl font-bold">{listerProfile.name}'s Listings</h2>
                            <div className="flex items-center gap-2">
                               <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />)}
                               </div>
                               <span className="text-sm text-slate-500">({listerProfile.reviews.length} reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4">Reviews</h3>
                    <div className="space-y-4">
                        {listerProfile.reviews.length > 0 ? listerProfile.reviews.map((r, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />)}
                                    </div>
                                    <p className="font-semibold">{r.by}</p>
                                </div>
                                <p className="text-slate-700 my-2">{r.comment}</p>
                                {r.photo && <img src={r.photo} alt="review" className="max-h-40 rounded-lg"/>}
                            </div>
                        )) : <p>No reviews yet.</p>}
                    </div>
                </div>

                {listerProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {listerProducts.map(p => (
                            <div key={p.id} onClick={() => handleProductClick(p)} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-100 flex flex-col cursor-pointer">
                              <div className="relative">
                                <img src={p.imageUrls[0]} alt={p.name} className="aspect-square w-full h-full object-cover rounded-t-xl" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/e2e8f0/64748b?text=Image' }} />
                                <div className="absolute top-2 left-0 right-0 px-2 flex justify-between items-start">
                                    {p.discount > 0 ? (<span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">{p.discount}% OFF</span>) : <div />}
                                    <button onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }} className="p-1.5 bg-white/90 rounded-full shadow-sm"><Heart className={`w-4 h-4 transition-all ${fav.includes(p.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} /></button>
                                </div>
                                <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-0.5 rounded-full text-xs font-medium">{p.cond}</div>
                              </div>
                              <div className="p-3 flex-grow flex flex-col">
                                <h3 className="font-semibold text-sm mb-1 truncate">{p.name}</h3>
                                <p className="text-slate-600 text-xs mb-3 line-clamp-2 flex-grow">{p.desc}</p>
                                <div className="flex items-center justify-between mt-auto pt-2 border-t">
                                  <span className="text-lg font-bold text-blue-600">${p.price.toFixed(2)}</span>
                                  <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition">Add</button>
                                </div>
                              </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl p-12 text-center border">
                        <Package className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                        <p className="text-lg text-slate-600">{listerProfile.name} has no items for sale.</p>
                    </div>
                )}
            </div>
        )}

        {view === 'cart' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
            {cart.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border">
                <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                <p className="text-lg text-slate-600">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(i => (
                  <div key={i.id} className="bg-white rounded-xl p-4 flex items-center gap-4 border border-slate-100">
                    <img src={i.imageUrls[0]} alt={i.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/e2e8f0/64748b?text=Image' }} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{i.name}</h3>
                      <p className="text-slate-600 text-xs">${i.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(i.id, -1)} className="w-7 h-7 bg-slate-100 rounded-md hover:bg-slate-200 transition">-</button>
                      <span className="w-8 text-center text-sm font-semibold">{i.quantity}</span>
                      <button onClick={() => updateQty(i.id, 1)} className="w-7 h-7 bg-slate-100 rounded-md hover:bg-slate-200 transition">+</button>
                    </div>
                    <div className="font-bold text-blue-600 w-20 text-right">${(calculateDiscountedPrice(i.price, i.discount) * i.quantity).toFixed(2)}</div>
                    <button onClick={() => removeCart(i.id)} className="p-1.5 hover:bg-slate-100 rounded-full transition"><X className="w-4 h-4 text-slate-500" /></button>
                  </div>
                ))}
                <div className="bg-white rounded-xl p-4 border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">${subtotal.toFixed(2)}</span>
                  </div>
                  <button onClick={() => setCheckout(true)} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">Proceed to Checkout</button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'profile' && currentUser && (
          <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <button onClick={() => setView('home')} className="p-2 hover:bg-slate-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
                <h2 className="text-2xl font-bold">My Profile</h2>
              </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-slate-100">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 text-center">
                        <div className="relative w-24 h-24 mx-auto mb-3 group">
                            {currentUser.profilePicture ? 
                                <img src={currentUser.profilePicture} alt=" " className="w-24 h-24 rounded-full object-cover"/>
                                : <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">{currentUser.name.charAt(0)}</div>
                            }
                            <label htmlFor="pfp-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera/>
                                <input type="file" id="pfp-upload" className="hidden" accept="image/*" onChange={handleProfilePictureChange}/>
                            </label>
                        </div>
                        <h3 className="text-xl font-bold">{currentUser.name}</h3>
                        <p className="text-slate-600 text-sm mb-6">{currentUser.email}</p>
                        
                        <div className="bg-white/50 rounded-lg p-4">
                            <p className="text-sm text-slate-600 mb-1">Balance</p>
                            <p className="text-3xl font-bold text-blue-600">${currentUser.balance.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-100 space-y-4">
                   <h3 className="text-lg font-bold">Quick Actions</h3>
                   <button onClick={() => setView('sales')} className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition">
                       <Send className="w-5 h-5" />
                       <span className="font-medium text-sm">My Sales</span>
                   </button>
                   <button onClick={() => setAddCredit(true)} className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition">
                       <Wallet className="w-5 h-5" />
                       <span className="font-medium text-sm">Add Credit</span>
                   </button>
                   <button onClick={() => setView('myListings')} className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-3 rounded-lg transition">
                       <Package className="w-5 h-5" />
                       <span className="font-medium text-sm">My Listings</span>
                   </button>
                   <button onClick={() => setView('sell')} className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-lg transition">
                       <Plus className="w-5 h-5" />
                       <span className="font-medium text-sm">Sell New Item</span>
                   </button>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Payment Methods</h3>
                <button onClick={() => setAddCard(true)} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  <Plus className="w-4 h-4" />Add Card
                </button>
              </div>
              {userCards.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-600 text-sm">No payment methods added yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {userCards.map(c => (
                    <div key={c.id} className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 text-white flex flex-col justify-between">
                      <div className="flex justify-between mb-3">
                        <CreditCard className="w-8 h-8 opacity-80" />
                        <Lock className="w-4 h-4 opacity-50" />
                      </div>
                      <p className="text-lg opacity-90 mb-2 font-mono tracking-wider">•••• •••• •••• {c.lastFour}</p>
                      <div className="flex justify-between items-end">
                        <p className="font-semibold text-sm">{c.cardName}</p>
                        <p className="text-xs opacity-75">{c.expiryDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold mb-4">My Coupons</h3>
                {availableCouponsForUser.length > 0 ? (
                    <div className="space-y-3">
                        {availableCouponsForUser.map(coupon => (
                            <div key={coupon.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-emerald-400 p-4 rounded-r-lg flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-emerald-800">{coupon.code}</p>
                                    <p className="text-sm text-emerald-600">
                                      {coupon.name ? coupon.name : `${coupon.type === 'fixed' ? `$${coupon.value} off` : `${coupon.value}% off`}.`}
                                      {coupon.minPurchase > 0 && ` Min spend $${coupon.minPurchase}.`} {coupon.category !== 'All' && ` On ${coupon.category}.`}
                                    </p>
                                </div>
                                <Tag className="w-8 h-8 text-emerald-400" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Tag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-600 text-sm">You have no available coupons.</p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <h3 className="text-lg font-bold mb-4">Purchase History</h3>
              {currentUser.purchaseHistory.length > 0 ? (
                  <div className="space-y-3">
                      {currentUser.purchaseHistory.map(order => (
                          <div key={order.orderId} className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                              <div>
                                  <p className="font-semibold">{order.orderId}</p>
                                  <p className="text-sm text-slate-500">{new Date(order.date).toLocaleDateString()} - ${order.total.toFixed(2)}</p>
                              </div>
                              <button onClick={() => { setLastOrder(order); setView('orderStatus'); }} className="text-sm text-blue-600 font-semibold hover:underline">View Details</button>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-600 text-sm">You haven't made any purchases yet.</p>
                  </div>
              )}
            </div>
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
                                                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                                 {sale.returnInfo?.status === 'requested' && (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-4">
                                        <h4 className="font-bold text-yellow-800">Return Requested</h4>
                                        <p className="text-sm text-yellow-700 mt-1"><b>Reason:</b> {sale.returnInfo.reason}</p>
                                        <div className="flex gap-2 mt-3">
                                            <button onClick={() => handleProcessReturn(sale, 'approved')} className="bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-md hover:bg-green-600">Approve Refund</button>
                                            <button onClick={() => handleProcessReturn(sale, 'rejected')} className="bg-red-500 text-white px-3 py-1 text-xs font-semibold rounded-md hover:bg-red-600">Reject Return</button>
                                        </div>
                                    </div>
                                 )}
                                 {sale.paymentMethod.type === 'face-to-face' && sale.status !== 'Completed' ? (
                                    <button onClick={() => setQrCodeModal({isOpen: true, orderId: sale.orderId})} className="w-full mt-4 bg-green-500 text-white py-2.5 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2">
                                        <QrCode className="w-5 h-5" />
                                        Scan Buyer's QR Code
                                    </button>
                                 ) : (
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const newStatus = e.target.status.value;
                                        const shippingService = e.target.service.value;
                                        const shippingDate = e.target.appointment.value;
                                        handleUpdateSale(sale.orderId, newStatus, { service: shippingService, appointment: shippingDate });
                                    }}>
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
                                 )}
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

        {view === 'sell' && currentUser && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setView('profile')} className="p-2 hover:bg-slate-100 rounded-lg transition"><ArrowLeft className="w-5 h-5" /></button>
              <h2 className="text-2xl font-bold">List an Item for Sale</h2>
            </div>
            <div className="space-y-4">
              <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-600">Item Name</label>
                  <input type="text" value={newProd.name} onChange={e => setNewProd({ ...newProd, name: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg focus:border-blue-500 focus:outline-none" />
                  {newProdErrors.name && <p className="text-red-500 text-xs mt-1">{newProdErrors.name}</p>}
              </div>
               <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-600">Price</label>
                  <input type="number" step="0.01" value={newProd.price} onChange={e => setNewProd({ ...newProd, price: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg focus:border-blue-500 focus:outline-none" />
                  {newProdErrors.price && <p className="text-red-500 text-xs mt-1">{newProdErrors.price}</p>}
                </div>
                 <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-600">Discount (%)</label>
                  <input type="number" value={newProd.discount} onChange={e => setNewProd({ ...newProd, discount: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg focus:border-blue-500 focus:outline-none" placeholder="e.g. 10" />
                  {newProdErrors.discount && <p className="text-red-500 text-xs mt-1">{newProdErrors.discount}</p>}
                </div>
              </div>
              <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-600">Images</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
                      {newProd.imageUrls.map((url, index) => (
                          <div key={index} className="relative aspect-square">
                              <img src={url} alt={`preview ${index}`} className="w-full h-full object-cover rounded-lg" />
                          </div>
                      ))}
                  </div>
                  <label htmlFor="image-upload" className="w-full flex flex-col items-center justify-center px-4 py-6 bg-white text-blue-600 rounded-lg shadow-sm tracking-wide uppercase border-2 border-dashed border-blue-300 cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition">
                      <UploadCloud className="w-8 h-8"/>
                      <span className="mt-2 text-base leading-normal">Select files</span>
                      <input id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'new')} />
                  </label>
                  {newProdErrors.imageUrls && <p className="text-red-500 text-xs mt-1">{newProdErrors.imageUrls}</p>}
              </div>
              <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-600">Stock Quantity</label>
                  <input type="number" min="1" value={newProd.stock} onChange={e => setNewProd({ ...newProd, stock: parseInt(e.target.value, 10) || 1 })} className="w-full px-3 py-2 text-sm border rounded-lg focus:border-blue-500 focus:outline-none" />
                  {newProdErrors.stock && <p className="text-red-500 text-xs mt-1">{newProdErrors.stock}</p>}
              </div>
              <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-600">Description</label>
                  <textarea value={newProd.desc} onChange={e => setNewProd({ ...newProd, desc: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg h-20 focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-xs font-semibold mb-1.5 text-slate-600">Category</label>
                      <select value={newProd.cat} onChange={e => setNewProd({ ...newProd, cat: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg focus:border-blue-500 focus:outline-none bg-white">
                          {cats.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                      </select>
                  </div>
                  <div>
                      <label className="block text-xs font-semibold mb-1.5 text-slate-600">Condition</label>
                      <select value={newProd.cond} onChange={e => setNewProd({ ...newProd, cond: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg focus:border-blue-500 focus:outline-none bg-white">
                          <option>Excellent</option>
                          <option>Very Good</option>
                          <option>Good</option>
                          <option>Fair</option>
                      </select>
                  </div>
              </div>
              <button onClick={handleAddProd} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">List Item</button>
            </div>
          </div>
        )}

        {view === 'myListings' && currentUser && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setView('profile')} className="p-2 hover:bg-slate-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
              <h2 className="text-2xl font-bold">My Listings</h2>
            </div>
            {myList.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                <p className="text-lg text-slate-600 mb-4">You haven't listed any items yet.</p>
                <button onClick={() => setView('sell')} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">Start Selling</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {myList.map(p => (
                  <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-100 relative">
                    {p.status === 'sold' && (
                        <div className="absolute inset-0 bg-slate-800/70 rounded-xl flex items-center justify-center z-10">
                            <span className="text-white text-xl font-bold border-4 border-white px-6 py-2 rounded-lg -rotate-12">SOLD</span>
                        </div>
                    )}
                    <img src={p.imageUrls[0]} alt={p.name} className="aspect-square w-full h-full object-cover rounded-t-xl" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/e2e8f0/64748b?text=Image' }} />
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-1 truncate">{p.name}</h3>
                      <div className="text-lg font-bold text-blue-600">${p.price.toFixed(2)}</div>
                        {p.status === 'available' && (
                          <button onClick={() => { setNewProdErrors({}); setEditingProduct({...p}); }} className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition">
                            <Edit className="w-4 h-4" /> Edit
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'orderStatus' && lastOrder && (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl p-8 border animate-modal-enter">
                    <div className="text-center">
                        <Check className="w-16 h-16 bg-green-500 text-white rounded-full p-3 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold">Order Confirmed!</h2>
                        <p className="text-slate-600 mb-2">Thank you for your purchase, {currentUser.name}.</p>
                        <p className="text-sm text-slate-500">Order ID: {lastOrder.orderId}</p>
                    </div>

                    <div className="my-6 border-t pt-6 text-left">
                        <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                        <div className="space-y-4">
                            {lastOrder.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <img src={item.imageUrls[0]} alt={item.name} className="w-16 h-16 object-cover rounded-lg"/>
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-lg">${(calculateDiscountedPrice(item.price, item.discount) * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t">
                            <p>Total</p>
                            <p>${lastOrder.total.toFixed(2)}</p>
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 my-6 text-left">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">Shipping to:</h3>
                            <p className="text-slate-600">{currentUser.name}</p>
                            <p className="text-slate-600">{lastOrder.shippingAddress}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">Payment Method:</h3>
                            <p className="text-slate-600">{lastOrder.paymentMethod.details}</p>
                        </div>
                    </div>

                    {lastOrder.shippingInfo?.service && (
                        <div className="text-left mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h3 className="font-bold text-lg mb-2 text-blue-800">Shipping Details</h3>
                            <p className="text-slate-600"><b>Service:</b> {lastOrder.shippingInfo.service}</p>
                            <p className="text-slate-600"><b>Scheduled Pickup:</b> {new Date(lastOrder.shippingInfo.appointment).toLocaleString()}</p>
                        </div>
                    )}
                    
                    <div className="text-left">
                        <h3 className="font-bold text-lg mb-4">Order Status</h3>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                           {['Processing', 'Shipped', 'Delivered', 'Refunded', 'Completed'].includes(lastOrder.status) && ['Processing', 'Shipped', lastOrder.paymentMethod.type === 'face-to-face' ? 'Completed' : 'Delivered'].map((status, index, arr) => (
                                <React.Fragment key={status}>
                                    <div className={`flex flex-col items-center ${arr.indexOf(lastOrder.status) >= index ? '' : 'opacity-50'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${arr.indexOf(lastOrder.status) >= index ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                            <Check className="w-5 h-5"/>
                                        </div>
                                        <p className="text-sm font-semibold mt-1">{status}</p>
                                    </div>
                                    {index < arr.length - 1 && <div className={`flex-1 h-0.5 ${arr.indexOf(lastOrder.status) > index ? 'bg-blue-600' : 'bg-slate-200'}`}></div>}
                                </React.Fragment>
                            ))}
                        </div>
                        {lastOrder.status === 'Return Requested' && <p className="text-center p-4 bg-yellow-100 text-yellow-800 rounded-lg">Your return is being processed by the seller.</p>}
                        {lastOrder.status === 'Refunded' && <p className="text-center p-4 bg-green-100 text-green-800 rounded-lg">This order has been successfully refunded.</p>}
                    </div>
                    {lastOrder.paymentMethod.type === 'face-to-face' && lastOrder.status !== 'Completed' && (
                        <button onClick={() => setQrCodeModal({isOpen: true, orderId: lastOrder.orderId})} className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2">
                            <QrCode className="w-5 h-5" /> Show QR Code for Pickup
                        </button>
                    )}
                    {lastOrder.status === 'Delivered' && !lastOrder.rated && (
                        <button onClick={() => setRatingModal({isOpen: true, order: lastOrder, rating: 0, hoverRating: 0, comment: '', photo: null})} className="w-full mt-6 bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition flex items-center justify-center gap-2">
                            <Star className="w-5 h-5"/> Rate Seller
                        </button>
                    )}
                    {lastOrder.status === 'Delivered' && !['requested', 'approved', 'rejected'].includes(lastOrder.returnInfo.status) && (
                        <button onClick={() => setReturnRequest({ isOpen: true, order: lastOrder, reason: '' })} className="w-full mt-4 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2">
                            <CornerDownLeft className="w-5 h-5"/> Request Return
                        </button>
                    )}
                    {lastOrder.returnInfo.status === 'requested' && (
                        <button onClick={() => setReturnRequest({ isOpen: true, order: lastOrder, reason: lastOrder.returnInfo.reason })} className="w-full mt-4 bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition text-sm">
                            <Edit className="w-5 h-5"/> Edit/Cancel Return Request
                        </button>
                    )}
                    <button onClick={() => setView('profile')} className="w-full mt-4 bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition">Back to Profile</button>
                </div>
            </div>
        )}

        {view === 'admin' && currentUser?.isAdmin && (
            <div>
                <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                     <Shield className="w-8 h-8 text-red-500"/>
                     <h2 className="text-3xl font-bold">Admin Panel</h2>
                </div>
                <div className="flex gap-2 mb-6">
                    <button onClick={() => setAdminView('users')} className={`px-4 py-2 rounded-lg font-semibold ${adminView === 'users' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>User Management</button>
                    <button onClick={() => setAdminView('orders')} className={`px-4 py-2 rounded-lg font-semibold ${adminView === 'orders' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>Order Management</button>
                    <button onClick={() => setAdminView('coupons')} className={`px-4 py-2 rounded-lg font-semibold ${adminView === 'coupons' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>Coupon Management</button>
                </div>

                {adminView === 'users' && (
                    <div className="bg-white p-6 rounded-xl border">
                        <h3 className="font-bold text-lg mb-4">All Users ({users.length})</h3>
                        <div className="space-y-2">
                            {users.map(u => (
                                <div key={u.id} className="grid grid-cols-4 gap-4 items-center p-3 bg-slate-50 rounded-lg">
                                    <p className="font-semibold">{u.name}</p>
                                    <p className="text-sm text-slate-600">{u.email}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">$</span>
                                        <input type="number" defaultValue={u.balance.toFixed(2)} onBlur={(e) => handleAdminUpdateBalance(u.id, e.target.value)} className="w-full px-2 py-1 border rounded-md"/>
                                    </div>
                                    <div>
                                        {u.isAdmin && <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-1 rounded-full">ADMIN</span>}
                                        {u.isService && <span className="text-xs font-bold text-blue-500 bg-blue-100 px-2 py-1 rounded-full">SUPPORT</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                 {adminView === 'orders' && (
                     <div className="bg-white p-6 rounded-xl border">
                         <h3 className="font-bold text-lg mb-4">All Orders ({allOrders.length})</h3>
                         <div className="space-y-2">
                             {allOrders.map(o => (
                                 <div key={o.orderId} className="p-3 bg-slate-50 rounded-lg text-sm">
                                     <div className="flex justify-between items-center">
                                         <p className="font-semibold">{o.orderId}</p>
                                         <p className="font-bold text-blue-600">${o.total.toFixed(2)}</p>
                                         <p className={`font-semibold px-2 py-1 rounded-full text-xs ${o.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{o.status}</p>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 )}
                 {adminView === 'coupons' && (
                     <div className="bg-white p-6 rounded-xl border">
                         <h3 className="font-bold text-lg mb-4">Coupon Management</h3>
                         <form onSubmit={handleCreateCoupon} className="grid grid-cols-2 md:grid-cols-6 gap-2 items-end bg-slate-50 p-3 rounded-lg mb-4">
                             <input value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value})} type="text" placeholder="CODE" className="px-2 py-1.5 border rounded-md text-sm col-span-2 md:col-span-1" required/>
                             <select value={newCoupon.type} onChange={e => setNewCoupon({...newCoupon, type: e.target.value})} className="px-2 py-1.5 border rounded-md text-sm bg-white"><option value="percentage">% off</option><option value="fixed">$ off</option></select>
                             <input value={newCoupon.value} onChange={e => setNewCoupon({...newCoupon, value: e.target.value})} type="number" placeholder="Value" className="px-2 py-1.5 border rounded-md text-sm" required/>
                             <input value={newCoupon.minPurchase} onChange={e => setNewCoupon({...newCoupon, minPurchase: e.target.value})} type="number" placeholder="Min. Purchase" className="px-2 py-1.5 border rounded-md text-sm"/>
                             <input value={newCoupon.quantity} onChange={e => setNewCoupon({...newCoupon, quantity: e.target.value})} type="number" placeholder="Quantity" className="px-2 py-1.5 border rounded-md text-sm" required/>
                             <button type="submit" className="bg-blue-500 text-white rounded-md text-sm h-full">Create</button>
                         </form>
                          <div className="space-y-3">
                             {allCoupons.map(c => (
                                 <div key={c.id} className="p-4 bg-slate-50 rounded-lg">
                                     <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center text-sm text-center md:text-left">
                                         <p className="font-semibold md:col-span-1">{c.code}</p>
                                         <p className="md:col-span-1">{c.type === 'fixed' ? `$${c.value}`: `${c.value}%`} off | Min: ${c.minPurchase}</p>
                                         <p className="md:col-span-1">Category: {c.category}</p>
                                         <p className="font-bold text-xs uppercase text-slate-500 md:col-span-1 md:text-right">{c.createdBy}</p>
                                     </div>
                                     <div className="mt-2">
                                         <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                                             <span>Usage</span>
                                             <span>{c.timesUsed} / {c.quantity} Used</span>
                                         </div>
                                         <div className="w-full bg-slate-200 rounded-full h-2.5">
                                             <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(c.timesUsed / c.quantity) * 100}%` }}></div>
                                         </div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 )}
            </div>
        )}

        {view === 'chat' && (
            <div className="max-w-2xl mx-auto">
                 <div className="bg-white rounded-xl shadow-lg border h-[70vh] flex flex-col">
                     <div className="p-4 border-b flex justify-between items-center">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">S</div>
                             <div>
                                 <h3 className="font-bold">Support Team</h3>
                                 <p className="text-xs text-green-500">Online</p>
                             </div>
                         </div>
                         <button onClick={() => setView('home')} className="p-2 hover:bg-slate-100 rounded-full"><X/></button>
                     </div>
                     <div ref={chatMessagesRef} className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50">
                         {(messages[3] || []).map((msg, i) => (
                              <div key={i} className={`flex items-end gap-2 ${msg.senderId === currentUser?.id ? 'justify-end' : ''}`}>
                                  {msg.senderId !== currentUser?.id && <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">S</div>}
                                  <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.senderId === currentUser?.id ? 'bg-blue-500 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
                                      {msg.text}
                                  </div>
                              </div>
                         ))}
                     </div>
                     <div className="p-4 border-t">
                          <div className="flex items-center gap-2">
                              <input 
                                  type="text" 
                                  placeholder="Type your message..." 
                                  value={chatInput}
                                  onChange={e => setChatInput(e.target.value)}
                                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                  className="w-full px-4 py-2 bg-slate-100 border-2 border-transparent rounded-lg focus:border-blue-500 focus:outline-none" 
                                  disabled={!currentUser}
                               />
                              <button onClick={handleSendMessage} disabled={!currentUser} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"><Send className="w-5 h-5"/></button>
                          </div>
                          {!currentUser && <p className="text-xs text-center text-red-500 mt-2">Please log in to chat with support.</p>}
                     </div>
                 </div>
            </div>
        )}

      </main>

      {showWinterAd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-modal-enter">
            <img src="https://images.unsplash.com/photo-1548883952-bf14d1033223?w=800" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Winter Fashion"/>
            <div className="relative p-12 text-center text-white">
              <h2 className="text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">Limited Time Offer</h2>
              <h1 className="text-5xl font-extrabold mb-4 leading-tight">Winter Sale</h1>
              <p className="max-w-xs mx-auto text-slate-300 mb-8">Get up to 40% off on selected winter fashion items. Stay warm and stylish!</p>
              <button 
                onClick={() => {
                  setShowWinterAd(false);
                  setCat('Fashion');
                }} 
                className="bg-white text-slate-900 font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-slate-200 transition-colors"
              >
                Shop Now
              </button>
            </div>
            <button onClick={() => setShowWinterAd(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
              <X className="w-6 h-6"/>
            </button>
          </div>
        </div>
      )}
      
      {selectedProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeProductModal}>
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-modal-enter" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 sm:p-8 grid md:grid-cols-2 gap-8">
                <div className="relative group aspect-square flex items-center justify-center bg-slate-100 rounded-lg">
                  <img src={selectedProduct.imageUrls[imageCarouselIndex]} alt={selectedProduct.name} className="max-w-full max-h-full object-contain rounded-lg" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x600/e2e8f0/64748b?text=Image' }} />
                  {selectedProduct.imageUrls.length > 1 && (
                      <>
                          <button onClick={(e) => { e.stopPropagation(); changeCarouselImage(-1); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                              <ChevronLeft className="h-6 w-6 text-slate-700"/>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); changeCarouselImage(1); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                              <ChevronRight className="h-6 w-6 text-slate-700"/>
                          </button>
                      </>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">{selectedProduct.cat}</span>
                    <button onClick={() => toggleFav(selectedProduct.id)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition">
                        <Heart className={`w-5 h-5 transition-all ${fav.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
                    </button>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">{selectedProduct.name}</h1>
                  {selectedProduct.discount > 0 ? (
                    <div className="flex items-baseline gap-3 mb-4">
                      <p className="text-3xl font-bold text-red-600">${calculateDiscountedPrice(selectedProduct.price, selectedProduct.discount).toFixed(2)}</p>
                      <p className="text-xl font-medium text-slate-400 line-through">${selectedProduct.price.toFixed(2)}</p>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-blue-600 mb-4">${selectedProduct.price.toFixed(2)}</p>
                  )}
                  <div className="border-t border-slate-200 pt-4 mb-4">
                      <div className="flex justify-between text-sm mb-2">
                          <span className="font-semibold text-slate-500">Condition</span>
                          <span className="text-slate-800 font-medium">{selectedProduct.cond}</span>
                      </div>
                  </div>
                  <div className="mb-6 flex-grow">
                    <h3 className="font-semibold text-sm mb-2 text-slate-500">Description</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{selectedProduct.desc}</p>
                  </div>
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      closeProductModal();
                    }} 
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition mt-auto"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
                <div className="md:col-span-2 border-t pt-6">
                    <h3 className="font-bold text-lg mb-4">Questions & Answers</h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {(selectedProduct.questions && selectedProduct.questions.length > 0) ? selectedProduct.questions.map(q => (
                            <div key={q.id} className="text-sm">
                                <p className="font-semibold text-slate-800"><HelpCircle className="inline w-4 h-4 mr-1" /> {q.userName}: <span className="font-normal">{q.text}</span></p>
                                {q.answer ? (
                                    <p className="ml-5 mt-1 text-slate-600 pl-5 border-l-2"><CornerDownLeft className="inline w-4 h-4 mr-1" />{getSeller(selectedProduct.sellerId)?.name}: <span className="font-normal">{q.answer}</span></p>
                                ) : (
                                    currentUser?.id === selectedProduct.sellerId && (
                                        <div className="ml-5 mt-2 flex gap-2">
                                            <input type="text" placeholder="Your answer..." onChange={(e) => setAnswer(e.target.value)} className="flex-grow px-2 py-1 border rounded-md text-sm" />
                                            <button onClick={() => handleAnswerQuestion(selectedProduct.id, q.id)} className="bg-blue-500 text-white px-3 py-1 text-xs rounded-md">Reply</button>
                                        </div>
                                    )
                                )}
                            </div>
                        )) : <p className="text-sm text-slate-500">No questions yet. Be the first to ask!</p>}
                    </div>
                    {currentUser && currentUser.id !== selectedProduct.sellerId && (
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold text-sm mb-2">Ask a question</h4>
                            <div className="flex gap-2">
                                <input type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Type your question..." className="w-full px-3 py-2 text-sm border rounded-lg focus:border-blue-500 focus:outline-none" />
                                <button onClick={() => handleAskQuestion(selectedProduct.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">Ask</button>
                            </div>
                        </div>
                    )}
                </div>
                <button onClick={closeProductModal} className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-slate-100 rounded-full transition"><X className="w-5 h-5 text-slate-600" /></button>
              </div>
            </div>
          </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditingProduct(null)}>
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-modal-enter" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Edit Listing</h2>
                <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5"/></button>
              </div>
              <div className="space-y-4">
                  <div>
                      <label className="block text-xs font-semibold mb-1.5 text-slate-600">Item Name</label>
                      <input type="text" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg focus:border-blue-500 focus:outline-none" />
                      {newProdErrors.name && <p className="text-red-500 text-xs mt-1">{newProdErrors.name}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs font-semibold mb-1.5 text-slate-600">Price: ${parseFloat(editingProduct.price).toFixed(2)}</label>
                          <input type="range" min="0" max="2000" step="0.01" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })} className="w-full" />
                          {newProdErrors.price && <p className="text-red-500 text-xs mt-1">{newProdErrors.price}</p>}
                      </div>
                      <div>
                          <label className="block text-xs font-semibold mb-1.5 text-slate-600">Discount: {editingProduct.discount}%</label>
                          <input type="range" min="0" max="99" value={editingProduct.discount} onChange={e => setEditingProduct({ ...editingProduct, discount: e.target.value })} className="w-full" />
                          {newProdErrors.discount && <p className="text-red-500 text-xs mt-1">{newProdErrors.discount}</p>}
                      </div>
                  </div>
                  <div>
                      <label className="block text-xs font-semibold mb-1.5 text-slate-600">Stock Quantity: {editingProduct.stock}</label>
                      <input type="range" min="1" max="100" value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: e.target.value })} className="w-full" />
                       {newProdErrors.stock && <p className="text-red-500 text-xs mt-1">{newProdErrors.stock}</p>}
                  </div>
                  <div>
                      <label className="block text-xs font-semibold mb-1.5 text-slate-600">Description</label>
                      <textarea value={editingProduct.desc} onChange={e => setEditingProduct({ ...editingProduct, desc: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg h-20 focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs font-semibold mb-1.5 text-slate-600">Category</label>
                          <select value={editingProduct.cat} onChange={e => setEditingProduct({ ...editingProduct, cat: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg focus:border-blue-500 focus:outline-none bg-white">
                              {cats.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-semibold mb-1.5 text-slate-600">Condition</label>
                          <select value={editingProduct.cond} onChange={e => setEditingProduct({ ...editingProduct, cond: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg focus:border-blue-500 focus:outline-none bg-white">
                              <option>Excellent</option>
                              <option>Very Good</option>
                              <option>Good</option>
                              <option>Fair</option>
                          </select>
                      </div>
                  </div>
                  <button onClick={handleUpdateProduct} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {authModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative animate-modal-enter">
            {appState === 'logging-in' ? (
                <div className="text-center">
                    <CheckAnimation />
                    <h2 className="text-2xl font-bold mb-2">Success!</h2>
                    <p className="text-slate-600">You are now logged in.</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-center mb-6"> <Logo /> </div>
                    <h2 className="text-2xl font-bold mb-1 text-center">{authMode === 'login' ? 'Welcome Back!' : 'Create Your Account'}</h2>
                    <p className="text-slate-500 text-center text-sm mb-6">{authMode === 'login' ? 'Sign in to continue' : 'Get started with a free account'}</p>
                    <div className="space-y-4">
                      {authMode === 'signup' && (
                        <>
                          <div>
                            <input type="text" placeholder="Full Name" value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none" />
                            {authErrors.name && <p className="text-red-500 text-xs mt-1">{authErrors.name}</p>}
                          </div>
                            <div>
                            <input type="text" placeholder="Home Address" value={authForm.address} onChange={e => setAuthForm({ ...authForm, address: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none" />
                            {authErrors.address && <p className="text-red-500 text-xs mt-1">{authErrors.address}</p>}
                          </div>
                          <div>
                            <div className="flex" ref={countryDropdownRef}>
                              <div className="relative">
                                <button onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)} className="h-full flex items-center gap-2 pl-3 pr-2 py-3 bg-slate-50 border-2 border-r-0 border-slate-200 rounded-l-lg focus:border-blue-500 focus:outline-none">
                                   <span className="text-xl">{countries.find(c => c.code === countryCode)?.flag}</span>
                                   <ChevronDown className="w-4 h-4 text-slate-400" />
                                </button>
                                {isCountryDropdownOpen && (
                                  <ul className="absolute bottom-full mb-2 left-0 w-80 max-h-60 overflow-y-auto bg-white border rounded-lg shadow-lg z-10">
                                    {countries.map(country => (
                                      <li key={country.code} onClick={() => { setCountryCode(country.code); setIsCountryDropdownOpen(false); }} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 cursor-pointer">
                                        <span className="text-xl">{country.flag}</span>
                                        <span className="text-sm text-slate-700">{country.name}</span>
                                        <span className="text-sm text-slate-500 ml-auto">{country.code}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              <input type="tel" placeholder="Phone Number" value={authForm.phone} onChange={e => setAuthForm({ ...authForm, phone: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-r-lg focus:border-blue-500 focus:outline-none" />
                            </div>
                            {authErrors.phone && <p className="text-red-500 text-xs mt-1">{authErrors.phone}</p>}
                          </div>
                        </>
                      )}
                      <div>
                        <input type="email" placeholder="Email Address" value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none" />
                         {authErrors.email && <p className="text-red-500 text-xs mt-1">{authErrors.email}</p>}
                      </div>
                      <div>
                        <input type="password" placeholder="Password" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none" />
                        {authErrors.password && <p className="text-red-500 text-xs mt-1">{authErrors.password}</p>}
                      </div>
                      <button onClick={handleAuth} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition shadow-md hover:shadow-lg">{authMode === 'login' ? 'Login' : 'Create Account'}</button>
                    </div>
                     {authErrors.general && <p className="text-red-500 text-xs mt-2 text-center">{authErrors.general}</p>}
                    <p className="text-center mt-4 text-sm">
                      {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                      <button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthErrors({}); }} className="text-blue-600 font-semibold">{authMode === 'login' ? 'Sign Up' : 'Login'}</button>
                    </p>
                    <button onClick={() => setAuthModal(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
                    {authMode === 'login' && <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-center">Demo: <span className="font-semibold">demo@example.com</span> / <span className="font-semibold">demo123</span></div>}
                </>
            )}
          </div>
        </div>
      )}
      
      {addCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full relative animate-modal-enter">
            <h2 className="text-2xl font-bold mb-6">Add New Card</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Card Number" value={cardForm.cardNumber} onChange={e => setCardForm({ ...cardForm, cardNumber: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none" />
              <input type="text" placeholder="Name on Card" value={cardForm.cardName} onChange={e => setCardForm({ ...cardForm, cardName: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="MM/YY" value={cardForm.expiryDate} onChange={e => setCardForm({ ...cardForm, expiryDate: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none" />
                <input type="text" placeholder="CVV" value={cardForm.cvv} onChange={e => setCardForm({ ...cardForm, cvv: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none" />
              </div>
              <button onClick={handleAddCard} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition">Add Card</button>
            </div>
            <button onClick={() => setAddCard(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}
      
      {cardAdded && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center animate-modal-enter">
            <CheckAnimation />
            <h2 className="text-2xl font-bold mb-2">Card Added!</h2>
            <p className="text-slate-600">Your new card has been saved.</p>
          </div>
        </div>
      )}

      {addCredit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full relative animate-modal-enter">
                <h2 className="text-2xl font-bold mb-6">Add Credit</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold mb-1.5 text-slate-600">Select Card</label>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                        {userCards.length > 0 ? userCards.map(c => (
                            <button key={c.id} onClick={() => setSelCard(c.id)} className={`w-full text-left p-3 rounded-lg border-2 transition ${selCard === c.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                                <p className="font-semibold">•••• {c.lastFour}</p>
                                <p className="text-xs text-slate-500">{c.cardName}</p>
                            </button>
                        )) : <p className="text-sm text-slate-500 p-3 bg-slate-50 rounded-lg">Please add a card first.</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold mb-1.5 text-slate-600">Amount</label>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                           <input type="number" placeholder="0.00" value={credit} onChange={e => setCredit(e.target.value)} className="w-full pl-7 pr-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none" />
                        </div>
                    </div>
                    <button onClick={handleCredit} disabled={!selCard} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">Add Credit</button>
                </div>
                <button onClick={() => setAddCredit(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
        </div>
    )}

    {checkout && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full animate-modal-enter">
              <h2 className="text-2xl font-bold mb-4 text-center">Confirm Purchase</h2>
              
              <div className="bg-slate-50 rounded-lg p-4 mb-4 text-left">
                <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                {appliedDiscount && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>
                      {appliedDiscount.name || `Code: ${appliedDiscount.code}`}
                    </span>
                    <span>
                      -${appliedDiscount.type === 'fixed' ? appliedDiscount.value.toFixed(2) : (subtotal * (appliedDiscount.value / 100)).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t"><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
              </div>

              {!appliedDiscount && (
                <div className="mb-4 space-y-2">
                  <div className="flex gap-2">
                    <input type="text" value={discountCodeInput} onChange={e => setDiscountCodeInput(e.target.value)} placeholder="Discount Code" className="w-full px-3 py-2 text-sm border rounded-lg focus:border-blue-500 focus:outline-none"/>
                    <button onClick={applyDiscountCode} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-300">Apply</button>
                  </div>
                  {discountError && <p className="text-red-500 text-xs text-left">{discountError}</p>}
                  {availableCouponsForUser.length > 0 && (
                    <div className="text-left">
                        <label className="block text-xs font-semibold mb-1.5 text-slate-600">Or select an available coupon:</label>
                        <select onChange={(e) => {
                            const coupon = availableCouponsForUser.find(c => c.id === e.target.value);
                            setAppliedDiscount(coupon || null);
                            setDiscountError('');
                        }} className="w-full px-3 py-2 text-sm border rounded-lg focus:border-blue-500 focus:outline-none bg-white">
                            <option value="">No Coupon</option>
                            {availableCouponsForUser.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                        </select>
                    </div>
                  )}
                </div>
              )}

              <h3 className="text-lg font-semibold mb-3 text-left">Payment Method</h3>
              <div className="space-y-3 mb-4 text-left">
                  <div onClick={() => setSelectedPaymentMethod('wallet')} className={`p-4 rounded-lg border-2 cursor-pointer transition flex justify-between items-center ${selectedPaymentMethod === 'wallet' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div>
                          <p className="font-semibold">Wallet Balance</p>
                          <p className="text-sm text-slate-500">Available: ${currentUser.balance.toFixed(2)}</p>
                      </div>
                      {selectedPaymentMethod === 'wallet' && <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-500"></div>}
                  </div>
                  {userCards.map(card => (
                      <div key={card.id} onClick={() => setSelectedPaymentMethod(card.id)} className={`p-4 rounded-lg border-2 cursor-pointer transition flex justify-between items-center ${selectedPaymentMethod === card.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                           <div>
                               <p className="font-semibold">•••• {card.lastFour}</p>
                               <p className="text-sm text-slate-500">{card.cardName}</p>
                           </div>
                           {selectedPaymentMethod === card.id && <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-500"></div>}
                      </div>
                  ))}
                  <div onClick={() => setSelectedPaymentMethod('face-to-face')} className={`p-4 rounded-lg border-2 cursor-pointer transition flex justify-between items-center ${selectedPaymentMethod === 'face-to-face' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div>
                          <p className="font-semibold">Face to Face</p>
                          <p className="text-sm text-slate-500">Pay on pickup</p>
                      </div>
                      {selectedPaymentMethod === 'face-to-face' && <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-500"></div>}
                  </div>
              </div>
              
              <div className="space-y-3 mt-6">
                  <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">Confirm & Pay ${finalTotal.toFixed(2)}</button>
                  <button onClick={() => setCheckout(false)} className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition">Cancel</button>
              </div>
          </div>
      </div>
    )}

    {returnRequest.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-xl p-8 max-w-md w-full relative animate-modal-enter">
                <h2 className="text-2xl font-bold mb-4">
                    {returnRequest.order.returnInfo.status === 'requested' ? 'Edit Return Request' : 'Request a Return'}
                </h2>
                <p className="text-sm text-slate-500 mb-4">Please provide a reason for returning the items in order <b>{returnRequest.order.orderId}</b>.</p>
                <textarea 
                    value={returnRequest.reason}
                    onChange={(e) => setReturnRequest(prev => ({...prev, reason: e.target.value}))}
                    className="w-full p-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none h-28"
                    placeholder="e.g., Item was not as described, arrived damaged, etc."
                />
                <div className="flex gap-4 mt-4">
                    <button onClick={() => setReturnRequest({isOpen: false, order: null, reason: ''})} className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition">Cancel</button>
                    <button onClick={() => handleRequestReturn(returnRequest.order.orderId, returnRequest.reason)} className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition">
                        {returnRequest.order.returnInfo.status === 'requested' ? 'Update Request' : 'Submit Request'}
                    </button>
                </div>
                {returnRequest.order.returnInfo.status === 'requested' && (
                     <button onClick={() => handleCancelReturnRequest(returnRequest.order.orderId)} className="w-full mt-2 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition text-sm">Cancel this Return Request</button>
                )}
                <button onClick={() => setReturnRequest({isOpen: false, order: null, reason: ''})} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
        </div>
    )}

    {showSuccessModal.show && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center animate-modal-enter">
          <CheckAnimation />
          <h2 className="text-2xl font-bold mb-2">{showSuccessModal.message}</h2>
          <p className="text-slate-600">{showSuccessModal.subMessage}</p>
        </div>
      </div>
    )}
     {ratingModal.isOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center animate-modal-enter">
          <h2 className="text-2xl font-bold mb-2">Rate Your Purchase</h2>
          <p className="text-slate-600 mb-4">How was your experience with the seller?</p>
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <Star 
                    key={i} 
                    className={`w-8 h-8 cursor-pointer transition-colors ${i < (ratingModal.hoverRating || ratingModal.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                    onMouseEnter={() => setRatingModal(prev => ({...prev, hoverRating: i + 1}))}
                    onMouseLeave={() => setRatingModal(prev => ({...prev, hoverRating: 0}))}
                    onClick={() => setRatingModal(prev => ({...prev, rating: i + 1}))}
                />
            ))}
          </div>
          <textarea 
            placeholder="Leave a comment..."
            value={ratingModal.comment}
            onChange={e => setRatingModal(prev => ({...prev, comment: e.target.value}))}
            className="w-full p-2 border rounded-lg h-24 mb-2"
          />
          <label htmlFor="review-photo" className="text-sm text-blue-600 cursor-pointer hover:underline">
            {ratingModal.photo ? 'Change photo' : 'Add a photo'}
            <input type="file" id="review-photo" accept="image/*" className="hidden" onChange={e => {
                if(e.target.files && e.target.files[0]) {
                    setRatingModal(prev => ({...prev, photo: URL.createObjectURL(e.target.files[0])}))
                }
            }}/>
          </label>
          {ratingModal.photo && <img src={ratingModal.photo} alt="review preview" className="max-h-20 mx-auto rounded-lg my-2"/>}

          <div className="flex gap-4 mt-4">
            <button onClick={() => setRatingModal({isOpen: false, order: null, rating: 0, hoverRating: 0, comment: '', photo: null})} className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition">Cancel</button>
            <button onClick={handlePostReview} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Submit Review</button>
          </div>
        </div>
      </div>
    )}
    {qrCodeModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setQrCodeModal({isOpen: false, orderId: null})}>
            <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center animate-modal-enter" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Complete Pickup</h2>
                <p className="text-slate-600 mb-4">
                    {currentUser.id === getSeller(products.find(p => lastOrder?.items.some(i => i.id === p.id))?.sellerId)?.id 
                        ? "Scan the buyer's QR code to complete the order."
                        : "Have the seller scan this QR code to complete your order."
                    }
                </p>
                <div className="flex justify-center my-4">
                    {/* Placeholder for actual QR code component */}
                    <div className="w-48 h-48 bg-slate-200 flex items-center justify-center">
                        <QrCode className="w-32 h-32" />
                    </div>
                </div>
                <p className="text-xs text-slate-500 mb-4">Order ID: {qrCodeModal.orderId}</p>
                {currentUser.id === getSeller(allOrders.find(o => o.orderId === qrCodeModal.orderId)?.items[0].sellerId)?.id && (
                    <button onClick={() => handleScanQRCode(qrCodeModal.orderId)} className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">
                        Simulate Scan & Complete
                    </button>
                )}
            </div>
        </div>
    )}
    </div>
    </>
  );
}
