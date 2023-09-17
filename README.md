# ppm - Personal Password Manager

**PPM** is a secure password manager that provids a command line interface (CLI) for managing and storing passwords with strong encryption. With ppm you can safeguard your sensitive information using the power of GPG encryption, ensuring your data remains confidentia and encrypted locally on your system.

## Features

- Strong Encryption: ppm leverages the robust encryption capabilities of GPG to protect your passwords and sensitive data.

- Local Encryption: Your passwords are stored securely on your system, ensuring that your data remains confidential and inaccessible to anyone without the appropriate GPG key.

- Password Generation: Generate strong, random passwords for your accounts with ease.

- Easy-to-Use CLI: A user-friendly command-line interface makes it simple to add, retrieve, and manage your passwords.

- Cross-Platform: GPGPass is platform agnostic, providing a consistent experience across different operating systems.

## Usage

List all orgs and pwds

```bash
$ ppm list
├── Personal
│   ├── some-website
│   └── another-website.com
├── Email
│   ├── myemail1@email.com
│   └── myemail2@email.com
└── Work
    ├── workemail@email.com
    ├── workapp.com
    └── another-work-related-passowrd
```

List all pwds under the specified org

```bash
$ ppm Personal
└── Personal
    ├── some-website
    └── another-website.com
```

Show pwd

```bash
$ ppm Personal/some-website
sup3r-s3cr3t-p455w0rd-123
```

Copy pwd to the clipboard

```bash
$ ppm -c Personal/some-website
copied Personal/some-website to clipboard
```

Add a password (If no org is specified the password will be added to the `Personal` org)

```bash
$ ppm add Gaming/chess.com
Enter pwd for 'Gaming/chess.com':

```

Generate a password for the specified org/item (can also be used with -c for copy to clipboard)

```bash
$ ppm gen Gaming/lichess.org
The generated password for 'Gaming/lichess.org' is: asd=,f0923)4@0pkja+/kl-asdf
```

Generate a password for the specified org/item (-h: hide the generated password, can also be used with -c for copy to clipboard)

```bash
$ ppm gen -q Gaming/lichess.org2
Generated password for 'Gaming/lichess.org'
```

Remove passowrd

```bash
$ ppm rm Gaming/lichess.org2
removed 'Gaming/lichess.org2'
```

## Install

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run ./src/index.ts
```

This project was created using `bun init` in bun v1.0.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
