import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://jytufkzqoqobcmnxuuhb.supabase.co"
const supabasePublishableKey = "sb_publishable_lUvrJX4CETn73RYQlENvRQ_6kk2NTg-"

export const supabase = createClient(supabaseUrl, supabasePublishableKey)