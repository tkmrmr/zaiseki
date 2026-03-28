FROM httpd:2.4-bookworm

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    ca-certificates git \
    python3.11 \
    python3.11-dev \
    python3.11-venv \
    python3-pip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN python3.11 -m pip install --no-cache-dir --break-system-packages mysql-connector-python