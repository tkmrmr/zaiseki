FROM debian:bookworm-slim AS builder

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    ca-certificates wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /tmp

RUN wget https://www.python.org/ftp/python/3.10.12/Python-3.10.12.tar.xz

FROM httpd:2.4-bookworm

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    build-essential libbz2-dev libdb-dev \
    libreadline-dev libffi-dev libgdbm-dev liblzma-dev \
    libncursesw5-dev libsqlite3-dev libssl-dev \
    zlib1g-dev uuid-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /tmp/Python-3.10.12.tar.xz /tmp/

RUN cd /tmp && tar xJf Python-3.10.12.tar.xz \
    && cd Python-3.10.12 \
    && ./configure --enable-optimizations \
    && make \
    && make install \
    && cd .. && rm -rf Python-3.10.12*

RUN python3 -m pip install --no-cache-dir --break-system-packages requests