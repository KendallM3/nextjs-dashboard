'use server';
 

import { z } from 'zod';
import { sql } from '@vercel/postgres';
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {

//   const rawFormData = {
//     customerId: formData.get('customerId'),
//     amount: formData.get('amount'),
//     status: formData.get('status'),
//   };

    const rawFormData = Object.fromEntries(formData.entries())
    const { customerId, amount, status } = CreateInvoice.parse(Object.fromEntries(formData.entries()))
  // Test it out:
  console.log(rawFormData);
  console.log('type of rawFormData amount: ', typeof rawFormData.amount);
  console.log('type of amount: ', typeof amount);
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;  
}