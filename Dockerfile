FROM httpd:2.4

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    ca-certificates git wget \
    python3.10 \
    python3.10-dev \
    python3.10-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN wget https://bootstrap.pypa.io/get-pip.py && \
    python3.10 get-pip.py && \
    rm get-pip.py

RUN pip3 install mysql-connector-python