# Database scripts – Autogarage Viorel (Supabase)

De app gebruikt **Supabase** voor occasions, admin-auto’s, diensten en (optioneel) page content. Zorg dat in je project de env-variabelen staan: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Supabase in één keer goed zetten

1. Ga in [Supabase](https://supabase.com) naar je project → **SQL Editor**.
2. Open het bestand **`supabase-init.sql`** uit deze map, kopieer de volledige inhoud en plak die in de SQL Editor.
3. Klik op **Run**. Het script:
   - verwijdert bestaande tabellen (indien aanwezig) in de juiste volgorde;
   - maakt alle tabellen aan: **users**, **cars**, **car_images**, **car_features**, **services**, **page_content**;
   - vult een optionele admin-gebruiker en standaard **page_content** voor de dienstenpagina.
4. Daarna is de database klaar. **Admin-login:** ga naar `/admin` en log in met wachtwoord **ViorelAdmin12** (de admin-gebruiker staat in de tabel **users**). Occasions beheer je daarna via **Admin** → **Auto’s** → **Nieuwe auto**.

## Admin-login (Supabase)

Het wachtwoord voor `/admin` staat in Supabase in de tabel **users** (rij met `role = 'admin'`). Geen env-variabele meer nodig.

- **Standaardwachtwoord** na het runnen van `supabase-init.sql`: **ViorelAdmin12**
- **Wachtwoord wijzigen:** in Supabase → **SQL Editor** onderstaand uitvoeren (vervang `NIEUW_WACHTWOORD` door je gekozen wachtwoord). Genereer eerst een hash:
  ```bash
  node -e "require('bcryptjs').hash('NIEUW_WACHTWOORD', 10).then(console.log)"
  ```
  Kopieer de output (bijv. `$2b$10$...`) en run in Supabase:
  ```sql
  UPDATE users SET password_hash = '$2b$10$... (jouw hash)' WHERE role = 'admin';
  ```

## Tabellen die de app gebruikt

| Tabel           | Gebruik |
|----------------|--------|
| **cars**       | Occasions (merk, model, prijs, foto’s, etc.). |
| **car_images** | Foto’s per auto (meerdere per occasion). |
| **car_features** | Kenmerken per auto (bijv. airco, cruise control). |
| **services**   | Diensten/tarieven (o.a. voor Admin → Diensten beheren). |
| **page_content** | Bewerkbare teksten per pagina (o.a. slug `diensten`). |
| **users**      | Admin-login: de app controleert het wachtwoord tegen `password_hash` van de gebruiker met `role = 'admin'`. |

## Overige scripts

- **001-create-tables.sql** – Alleen tabellen aanmaken (geen drop). Handig als je niets wilt wissen.
- **002-fix-database.sql** – Alles droppen en opnieuw aanmaken (oude stijl, vergelijkbaar met supabase-init).
- **004-create-services-table.sql** – Alleen de **services**-tabel toevoegen als die nog ontbreekt.
- **006-page-content.sql** – Alleen **page_content**-tabel + seed. Overbodig als je **supabase-init.sql** al hebt gedraaid.

## Connectie controleren

- **Lokaal:** Zet in `.env.local` de drie Supabase-variabelen (zie `.env.example`), herstart `npm run dev`, en ga naar `/occasions` en `/admin`.
- **Vercel:** Zet dezelfde variabelen in **Project → Settings → Environment Variables** (Production) en voer een **Redeploy** uit.

Als je de fout “Missing Supabase environment variables” ziet, ontbreken de variabelen in de omgeving of moet je opnieuw deployen na het toevoegen.
