#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from wsgiref.handlers import CGIHandler

from app import create_app

if __name__ == "__main__":
    app = create_app()
    CGIHandler().run(app)
