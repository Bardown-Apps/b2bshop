import { ShoppingCart, RefreshCw, Archive, ImageIcon, HelpCircle, Megaphone, ClipboardList } from 'lucide-react'

export const ACTIONS = [
  { label: 'New Order', icon: ShoppingCart },
  { label: 'WIP', icon: RefreshCw },
  { label: 'Historical', icon: Archive },
  { label: 'Graphics Requests', icon: ImageIcon },
  { label: 'FAQs', icon: HelpCircle },
  { label: 'Announcements', icon: Megaphone },
  { label: 'Order Form', icon: ClipboardList },
]

export const CATEGORIES = ['All', 'Tops', 'Headwear', 'Accessories', 'Bottoms', 'Uniforms', 'Summer Jerseys']

export const FILTER_OPTIONS = {
  Clubs: ['All Teams', 'Bow Valley Flames', 'Cochrane Rockies', 'Calgary Flames Jr.'],
  Size: ['S', 'M', 'L', 'XL', '2XL', 'Youth'],
  Color: ['Black', 'Red', 'White', 'Navy', 'Red/Black'],
}

export const PRODUCTS = [
  { id: 1, name: 'Bow Valley Flames Tracksuit', club: 'Bow Valley Flames', price: '$89.99', category: 'Tops', color: 'Black/Red', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 2, name: 'Cochrane Rockies Classic 4.0 Toque', club: 'Cochrane Rockies', price: '$34.99', category: 'Headwear', color: 'Red/Black/White', sizes: ['One Size'] },
  { id: 3, name: 'Cochrane Rockies Classic 4.0 Mitts', club: 'Cochrane Rockies', price: '$44.99', category: 'Accessories', color: 'Red/Black', sizes: ['S/M', 'L/XL'] },
  { id: 4, name: 'Team Performance Polo', club: 'All Teams', price: '$54.99', category: 'Tops', color: 'Navy/White', sizes: ['S', 'M', 'L', 'XL', '2XL'] },
  { id: 5, name: 'Classic Cap', club: 'All Teams', price: '$29.99', category: 'Headwear', color: 'Black', sizes: ['One Size'] },
  { id: 6, name: 'Training Shorts', club: 'All Teams', price: '$39.99', category: 'Bottoms', color: 'Black', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 7, name: 'Summer Game Jersey', club: 'All Teams', price: '$64.99', category: 'Summer Jerseys', color: 'White/Red', sizes: ['S', 'M', 'L', 'XL', '2XL'] },
  { id: 8, name: 'Youth Game Jersey', club: 'All Teams', price: '$54.99', category: 'Summer Jerseys', color: 'Red/Black', sizes: ['YS', 'YM', 'YL', 'YXL'] },
  { id: 9, name: 'Full-Zip Warm-Up Jacket', club: 'All Teams', price: '$79.99', category: 'Tops', color: 'Black/Red', sizes: ['S', 'M', 'L', 'XL'] },
]

export const ACTION_DESCRIPTIONS = {
  'New Order': 'Start a new order by browsing the catalogue below.',
  'WIP': 'Your work-in-progress orders will appear here.',
  'Historical': 'Your past completed orders will appear here.',
  'Graphics Requests': 'Submit a graphics or artwork request here.',
  'FAQs': 'Frequently asked questions will appear here.',
  'Announcements': 'No new announcements at this time.',
  'Order Form': 'Download or fill out your order form below.',
}
