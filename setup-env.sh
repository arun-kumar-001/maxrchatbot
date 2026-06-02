#!/bin/bash

# Simple script to setup environment files

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created root .env"
fi

if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "Created backend/.env"
fi

if [ ! -f frontend/.env ]; then
  cp frontend/.env.example frontend/.env
  echo "Created frontend/.env"
fi

echo "Environment files created. Please update them with your actual configuration."
