INSERT INTO public.user_roles (user_id, role)
VALUES ('b9fe63eb-301c-4748-a875-e49f962c1309', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;