#!/bin/bash

# Membersihkan layar
clear

# Header ASCII yang lebih berwarna dan rapi
echo -e "\e[1;32m      ╭──────────────────────────────────────────╮"
echo -e "      │         🚀 WHATSAPP TERMUX CLI 🚀        │"
echo -e "      │       Developed for: Fitunnel            │"
echo -e "      ╰──────────────────────────────────────────╯\e[0m"

echo -e "\e[1;33m[!] Sedang membangunkan mesin Chromium...\e[0m"
echo -e "\e[1;34m[*] Harap tunggu sebentar, ini butuh waktu 10-20 detik.\e[0m"
echo ""

# Memberikan sedikit animasi loading sederhana
sleep 2

# Menjalankan script utama
node chat.js

