create table api_calls
(
    id              int auto_increment
        primary key,
    api_endpoint    varchar(255)                        null,
    response_status int                                 null,
    created_at      timestamp default CURRENT_TIMESTAMP null
);

create table icon
(
    id  int auto_increment
        primary key,
    url varchar(20) null
)
    charset = utf8mb3
    row_format = DYNAMIC;

create table log
(
    id       int auto_increment
        primary key,
    username varchar(20) null,
    uri      varchar(50) null,
    logTime  varchar(20) null
)
    charset = utf8mb3
    row_format = DYNAMIC;

create table onebox_user
(
    id          bigint auto_increment
        primary key,
    phone       varchar(15)                                                                                                                                                   null comment '电话',
    password    varchar(200)                                                                                                                                                  null comment '密码',
    avatar_url  varchar(500) default 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132' null comment '头像',
    nick_name   varchar(50)  default '默认用户'                                                                                                                               null comment '昵称',
    openid      varchar(200)                                                                                                                                                  null,
    session_key varchar(200)                                                                                                                                                  null,
    unionid     varchar(200)                                                                                                                                                  null,
    sex         tinyint(1)   default 1                                                                                                                                        null comment '性别，0女1男',
    intro       varchar(256)                                                                                                                                                  null comment '简介',
    create_time datetime                                                                                                                                                      null,
    update_time datetime                                                                                                                                                      null,
    constraint un_1
        unique (phone),
    constraint un_2
        unique (openid)
)
    collate = utf8mb4_german2_ci;

create table page_visits
(
    id             int auto_increment
        primary key,
    page_path      varchar(255)                        null,
    visit_duration int                                 null,
    created_at     timestamp default CURRENT_TIMESTAMP null
);

create table role
(
    id   int auto_increment
        primary key,
    name varchar(50) null
)
    charset = utf8mb3
    row_format = DYNAMIC;

create table admin
(
    id         int auto_increment
        primary key,
    username   varchar(20)                      null,
    password   varchar(200) collate utf8mb3_bin null,
    phone      varchar(11)                      null,
    email      varchar(25)                      null,
    rid        int                              null,
    status     int                              null,
    createtime varchar(25)                      null,
    constraint FK_admin
        foreign key (rid) references role (id)
)
    charset = utf8mb3
    row_format = DYNAMIC;

create table treemenu
(
    id   int auto_increment
        primary key,
    pid  int          null,
    name varchar(10)  null,
    icon varchar(50)  null,
    url  varchar(100) null
)
    charset = utf8mb3
    row_format = DYNAMIC;

create table role_treemenu
(
    id  int auto_increment
        primary key,
    rid int null,
    tid int null,
    constraint FK_role_treemenu
        foreign key (rid) references role (id),
    constraint FK_role_treemenu1
        foreign key (tid) references treemenu (id)
)
    charset = utf8mb3
    row_format = DYNAMIC;

create table user
(
    id           int auto_increment
        primary key,
    user_name    varchar(50)          not null,
    user_number  varchar(255)         not null,
    email        varchar(100)         not null,
    phone        varchar(20)          null,
    login_date   date                 not null,
    finally_date datetime             null,
    state        tinyint(1) default 1 null,
    constraint email
        unique (email)
);

create table message_log
(
    id              int auto_increment
        primary key,
    session_id      int      not null,
    Sender_id       int      not null,
    message_content text     null,
    picture_id      int      null,
    dateline        datetime not null,
    constraint message_log_ibfk_1
        foreign key (Sender_id) references user (id)
);

create index Sender_id
    on message_log (Sender_id);

create table picture
(
    id           int auto_increment
        primary key,
    message_id   int          null,
    picture_data longblob     not null,
    picture_type varchar(50)  not null,
    picture_name varchar(255) not null,
    constraint message_id
        unique (message_id),
    constraint picture_ibfk_1
        foreign key (message_id) references message_log (id)
            on delete cascade
);

create table user_combinations
(
    id               int auto_increment
        primary key,
    combination_data json                                null,
    prompt           text                                null,
    created_at       timestamp default CURRENT_TIMESTAMP null
);

create table user_operation
(
    id                int auto_increment
        primary key,
    user_id           int                  not null,
    operation_type    varchar(50)          not null,
    operation_new     varchar(255)         null,
    operation_details text                 null,
    operation_time    datetime             not null,
    iP_address        varchar(45)          null,
    operating_result  tinyint(1) default 1 null,
    constraint user_operation_ibfk_1
        foreign key (user_id) references user (id)
);

create index user_id
    on user_operation (user_id);

create table user_selections
(
    id           int auto_increment
        primary key,
    product_type varchar(50)                         null,
    element      varchar(50)                         null,
    color        varchar(50)                         null,
    style        varchar(50)                         null,
    created_at   timestamp default CURRENT_TIMESTAMP null
);

create table users
(
    id         int auto_increment
        primary key,
    email      varchar(255)                        not null,
    password   varchar(255)                        null,
    name       varchar(255)                        null,
    created_at timestamp default CURRENT_TIMESTAMP null,
    updated_at timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint email
        unique (email)
);

create index idx_email
    on users (email);

create table verification_codes
(
    id              int auto_increment
        primary key,
    email           varchar(255)                         not null,
    code            varchar(6)                           not null,
    expiration_time timestamp                            not null,
    used            tinyint(1) default 0                 null,
    created_at      timestamp  default CURRENT_TIMESTAMP null
);

create index idx_verification_code
    on verification_codes (code);

create index idx_verification_email
    on verification_codes (email);


