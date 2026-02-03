export interface BudgetHeaderData {
  orcamento: string;
  cliente: string;
  data: string;
}

export interface BudgetItem {
  id: string; // unique key for react rendering
  item: string;
  cod: string;
  desc: string;
  qtd: string;
  topPosition: number; // useful for sorting
}

export interface SeparationItem extends BudgetItem {
  checked: boolean;
}

export interface DeliveryDetails {
  receiverName: string;
  employeeName: string;
  timestamp: string;
}

export type OrderStatus = 'pending' | 'in_progress' | 'delivered';

export interface Order {
  id: string; // Unique internal ID
  header: BudgetHeaderData;
  items: SeparationItem[];
  status: OrderStatus;
  deliveryDetails?: DeliveryDetails;
  createdAt: number;
}

export interface ParsedBudget {
  header: BudgetHeaderData;
  items: BudgetItem[];
}