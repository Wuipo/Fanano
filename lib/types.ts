export interface Booking {
  id: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  num_people: number;
  notes: string | null;
  created_at: string;
}

export type NewBooking = Omit<Booking, "id" | "created_at">;
