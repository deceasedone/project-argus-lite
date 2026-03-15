# Dockerfile
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your project into the container
COPY . .

# We don't set a CMD here because we will use docker-compose to run either the API or the UI.