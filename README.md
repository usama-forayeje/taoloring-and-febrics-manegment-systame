# Ladies Tailoring Management System

A modern, role-based dashboard system for managing ladies tailoring businesses with multiple shop locations.

## Features

- **Role-Based Access Control**: Different dashboards for Admin, Shop Manager, and Workers
- **Multi-Shop Management**: Switch between shops with intelligent role-based filtering
- **Modern UI/UX**: Built with shadcn/ui, Framer Motion animations, and premium design
- **Real-time Data**: React Query for efficient data fetching and caching
- **Appwrite Backend**: Comprehensive database integration with TypeScript support

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Backend**: Appwrite
- **Styling**: Tailwind CSS with custom design tokens

## Appwrite Setup Guide

### 1. Create Appwrite Project

1. Go to [Appwrite Console](https://cloud.appwrite.io/)
2. Create a new project
3. Note down your Project ID

### 2. Create Database

1. Go to Databases section
2. Create a new database
3. Note down your Database ID

### 3. Create Collections

Create the following collections with these attributes:

#### Users Collection
\`\`\`
Collection ID: users
Attributes:
- name (string, required)
- email (string, required, unique)
- role (enum: superAdmin, admin, manager, tailor, embroideryMan, stoneMan)
- shopId (string, optional)
- phone (string, optional)
- address (string, optional)
- salary (number, optional)
- joinDate (datetime, required)
- isActive (boolean, default: true)
\`\`\`

#### Shops Collection
\`\`\`
Collection ID: shops
Attributes:
- name (string, required)
- address (string, optional)
- contact (string, optional)
- createdAt (datetime, required)
- isActive (boolean, default: true)
\`\`\`

#### Customers Collection
\`\`\`
Collection ID: customers
Attributes:
- name (string, required)
- phone (string, required)
- email (string, optional)
- address (string, optional)
- shopId (string, required)
- createdAt (datetime, required)
\`\`\`

#### Orders Collection
\`\`\`
Collection ID: orders
Attributes:
- customerId (string, required)
- shopId (string, required)
- orderDate (datetime, required)
- deliveryDate (datetime, required)
- status (enum: pending, inProgress, completed, delivered, cancelled)
- totalAmount (number, required)
- paidAmount (number, default: 0)
- notes (string, optional)
- assignedTo (string, optional)
\`\`\`

#### Order Items Collection
\`\`\`
Collection ID: orderItems
Attributes:
- orderId (string, required)
- itemType (string, required)
- description (string, optional)
- measurements (string, optional)
- price (number, required)
- status (enum: pending, cutting, stitching, embroidery, stone, finishing, completed)
- assignedWorker (string, optional)
\`\`\`

#### Catalog Collection
\`\`\`
Collection ID: catalog
Attributes:
- name (string, required)
- category (string, required)
- price (number, required)
- description (string, optional)
- shopId (string, required)
- isActive (boolean, default: true)
\`\`\`

#### Transactions Collection
\`\`\`
Collection ID: transactions
Attributes:
- type (enum: income, expense)
- amount (number, required)
- description (string, required)
- category (string, required)
- shopId (string, required)
- date (datetime, required)
- orderId (string, optional)
\`\`\`

#### Payments Collection
\`\`\`
Collection ID: payments
Attributes:
- orderId (string, required)
- amount (number, required)
- paymentMethod (enum: cash, card, upi, bank)
- paymentDate (datetime, required)
- notes (string, optional)
\`\`\`

#### Expenses Collection
\`\`\`
Collection ID: expenses
Attributes:
- description (string, required)
- amount (number, required)
- category (string, required)
- shopId (string, required)
- date (datetime, required)
- receipt (string, optional)
\`\`\`

#### Salaries Collection
\`\`\`
Collection ID: salaries
Attributes:
- userId (string, required)
- amount (number, required)
- month (string, required)
- year (number, required)
- paidDate (datetime, optional)
- status (enum: pending, paid)
- shopId (string, required)
\`\`\`

#### Job Payments Collection
\`\`\`
Collection ID: jobPayments
Attributes:
- workerId (string, required)
- orderItemId (string, required)
- amount (number, required)
- paidDate (datetime, required)
- shopId (string, required)
\`\`\`

#### Fabrics Collection
\`\`\`
Collection ID: fabrics
Attributes:
- name (string, required)
- type (string, required)
- color (string, required)
- quantity (number, required)
- pricePerUnit (number, required)
- shopId (string, required)
- supplier (string, optional)
\`\`\`

#### Fabric Sales Collection
\`\`\`
Collection ID: fabricSales
Attributes:
- fabricId (string, required)
- customerId (string, required)
- quantity (number, required)
- pricePerUnit (number, required)
- totalAmount (number, required)
- saleDate (datetime, required)
- shopId (string, required)
\`\`\`

#### Feedback Collection
\`\`\`
Collection ID: feedback
Attributes:
- customerId (string, required)
- orderId (string, required)
- rating (number, required, min: 1, max: 5)
- comment (string, optional)
- date (datetime, required)
- shopId (string, required)
\`\`\`

#### Work Log Collection
\`\`\`
Collection ID: workLog
Attributes:
- workerId (string, required)
- orderItemId (string, required)
- workType (string, required)
- startTime (datetime, required)
- endTime (datetime, optional)
- status (enum: started, paused, completed)
- notes (string, optional)
- shopId (string, required)
\`\`\`

#### Notifications Collection
\`\`\`
Collection ID: notifications
Attributes:
- userId (string, required)
- title (string, required)
- message (string, required)
- type (enum: info, warning, success, error)
- isRead (boolean, default: false)
- createdAt (datetime, required)
- shopId (string, optional)
\`\`\`

### 4. Create Storage Buckets

Create the following storage buckets:

1. **Avatars Bucket** (ID: avatars)
   - For user profile pictures
   - Permissions: Users can read/write their own files

2. **Documents Bucket** (ID: documents)
   - For order documents, receipts, etc.
   - Permissions: Based on user roles

3. **Images Bucket** (ID: images)
   - For product images, fabric photos, etc.
   - Permissions: Based on user roles

### 5. Set Permissions

For each collection, set appropriate permissions:

- **Admin/SuperAdmin**: Full CRUD access to all collections
- **Manager**: Read/Write access to their shop's data only
- **Workers**: Read access to their assigned tasks, Write access to work logs

### 6. Environment Variables

Add these environment variables to your project:

\`\`\`env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_STORAGE_ID=your_storage_id

# Collection IDs
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_SHOPS_COLLECTION_ID=shops
NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID=customers
NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID=orders
NEXT_PUBLIC_APPWRITE_ORDER_ITEMS_COLLECTION_ID=orderItems
NEXT_PUBLIC_APPWRITE_CATALOG_COLLECTION_ID=catalog
NEXT_PUBLIC_APPWRITE_TRANSACTIONS_COLLECTION_ID=transactions
NEXT_PUBLIC_APPWRITE_PAYMENTS_COLLECTION_ID=payments
NEXT_PUBLIC_APPWRITE_EXPENSES_COLLECTION_ID=expenses
NEXT_PUBLIC_APPWRITE_SALARIES_COLLECTION_ID=salaries
NEXT_PUBLIC_APPWRITE_JOB_PAYMENTS_COLLECTION_ID=jobPayments
NEXT_PUBLIC_APPWRITE_FABRICS_COLLECTION_ID=fabrics
NEXT_PUBLIC_APPWRITE_FABRIC_SALES_COLLECTION_ID=fabricSales
NEXT_PUBLIC_APPWRITE_FEEDBACK_COLLECTION_ID=feedback
NEXT_PUBLIC_APPWRITE_WORK_LOG_COLLECTION_ID=workLog
NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID=notifications

# Bucket IDs
NEXT_PUBLIC_APPWRITE_AVATARS_BUCKET_ID=avatars
NEXT_PUBLIC_APPWRITE_DOCUMENTS_BUCKET_ID=documents
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=images

# Function IDs (if using Appwrite Functions)
NEXT_PUBLIC_APPWRITE_SEND_NOTIFICATION_FUNCTION_ID=sendNotification
NEXT_PUBLIC_APPWRITE_GENERATE_REPORT_FUNCTION_ID=generateReport
\`\`\`

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your Appwrite project following the guide above
4. Add environment variables
5. Run the development server: `npm run dev`

## User Roles

- **Super Admin/Admin**: Full system access, can manage all shops, users, and data
- **Shop Manager**: Access to their assigned shop only, can manage shop operations
- **Workers** (Tailor, Embroidery, Stone): Individual dashboards with task management

## Key Features

- **Shop Switching**: Intelligent shop switcher that shows relevant shops based on user role
- **Role Management**: Admins can create users, assign roles, and manage permissions
- **Real-time Updates**: Live data synchronization across all dashboards
- **Premium UI**: Modern design with smooth animations and responsive layout
- **Data Visualization**: Charts and analytics for business insights
