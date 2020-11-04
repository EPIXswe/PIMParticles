package com.blackhatjava;

import express.Express;

public class Test {

    Express express = new Express();

    public Test() {
        express.listen(5000);
    }

}
