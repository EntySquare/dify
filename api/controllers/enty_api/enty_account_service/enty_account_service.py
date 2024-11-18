import base64
import logging
import secrets
from datetime import datetime, timezone
from typing import Optional

from constants.languages import language_timezone_mapping, languages
from extensions.ext_database import db
from libs.password import hash_password
from libs.rsa import generate_key_pair
from models.account import Account, AccountStatus, Tenant
from services.account_service import AccountService, AccountStatus
from services.errors.account import (
    AccountRegisterError,
)


class EntyAccountService:

    @classmethod
    def register(
        cls,
        email,
        name,
        password: Optional[str] = None,
        open_id: Optional[str] = None,
        provider: Optional[str] = None,
        language: Optional[str] = None,
        status: Optional[AccountStatus] = None,
        is_setup: Optional[bool] = False,
    ) -> Account:
        db.session.begin_nested()
        """Register account"""
        try:
            account = EntyAccountService.create_account(
                email=email,
                name=name,
                interface_language=language or languages[0],
                password=password,
                is_setup=is_setup,
            )

            account.status = AccountStatus.ACTIVE.value if not status else status.value
            account.initialized_at = datetime.now(timezone.utc).replace(tzinfo=None)

            if open_id is not None or provider is not None:
                AccountService.link_account_integrate(provider, open_id, account)

            db.session.commit()
        except Exception as e:
            db.session.rollback()
            logging.exception(f"Register failed: {e}")
            raise AccountRegisterError(f"Registration failed: {e}") from e

        return account
    
    @staticmethod
    def create_account(
        email: str,
        name: str,
        interface_language: str,
        password: Optional[str] = None,
        interface_theme: str = "light",
        is_setup: Optional[bool] = False,
    ) -> Account:
        """create account"""
        account = Account()
        account.email = email
        account.name = name

        if password:
            # generate password salt
            salt = secrets.token_bytes(16)
            base64_salt = base64.b64encode(salt).decode()

            # encrypt password with salt
            password_hashed = hash_password(password, salt)
            base64_password_hashed = base64.b64encode(password_hashed).decode()

            account.password = base64_password_hashed
            account.password_salt = base64_salt

        account.interface_language = interface_language
        account.interface_theme = interface_theme

        # Set timezone based on language
        account.timezone = language_timezone_mapping.get(interface_language, "UTC")

        db.session.add(account)
        db.session.commit()
        return account
    
    @staticmethod
    def create_tenant(name: str, is_setup: Optional[bool] = False, is_from_dashboard: Optional[bool] = False) -> Tenant:
        """Create tenant"""
        tenant = Tenant(name=name)

        db.session.add(tenant)
        db.session.commit()

        tenant.encrypt_public_key = generate_key_pair(tenant.id)
        db.session.commit()
        return tenant