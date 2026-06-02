# 1. Usar una imagen oficial de Python ligera
FROM python:3.11-slim

# 2. Variables de entorno para optimizar Python en Docker
# Evita que Python genere archivos .pyc
ENV PYTHONDONTWRITEBYTECODE=1 
# Asegura que los logs salgan directo a la consola de VS Code
ENV PYTHONUNBUFFERED=1 

# 3. Definir la carpeta de trabajo dentro del contenedor
WORKDIR /app

# 4. Instalar dependencias del sistema operativo (necesarias para conectar PostgreSQL)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 5. Copiar el archivo de dependencias y ejecutarlas
COPY requirements.txt /app/
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# 6. Copiar el resto del código de tu carpeta /backend al contenedor
COPY . /app/

# 7. Exponer el puerto por donde se comunicará la API
EXPOSE 8000

# 8. Comando final: Encender el servidor
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]