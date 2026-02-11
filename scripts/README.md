# Database scripts – Autogarage Viorel

## Welk script wanneer?

| Script | Wanneer gebruiken |
|--------|--------------------|
| **001-create-tables.sql** | **Eerste keer** opzetten. Maakt alleen tabellen aan als ze nog niet bestaan. Verwijdert geen data. |
| **002-fix-database.sql** | **Reset**: alles weggooien en opnieuw beginnen. Verwijdert alle tabellen en maakt ze opnieuw. |
| **supabase-init.sql** | Zelfde idee als 002 (drop + create). Kan als alternatief worden gebruikt. |

Er staat **geen sample- of testdata** in deze scripts. De database start leeg (alleen de admin-gebruiker). Occasions voeg je toe via het adminpanel: inloggen → Auto's beheren → Nieuwe auto.

## Stappen

1. Ga in Supabase naar **SQL Editor**.
2. Kies **één** script:
   - Nog geen tabellen? → **001-create-tables.sql** kopiëren en uitvoeren.
   - Alles opnieuw willen? → **002-fix-database.sql** of **supabase-init.sql** kopiëren en uitvoeren.
3. Na het runnen kun je inloggen op het adminpanel met:
   - **E-mail:** admin@autogarage-viorel.nl  
   - **Wachtwoord:** admin123  
   Wijzig dit wachtwoord na de eerste login.

## Diensten (services)

- **001** en **002** maken ook de **services**-tabel aan. De pagina **/diensten** (Werkplaats) haalt haar content daar vandaan.
- Als je alleen **001** of **002** eerder hebt gedraaid **zonder** services-tabel, run dan **004-create-services-table.sql** om alleen die tabel toe te voegen.
- Beheer diensten en tarieven via **Admin → Diensten beheren**: prijzen, teksten, welke diensten getoond worden (bijv. APK keuring, onderhoud, banden, etc.).
