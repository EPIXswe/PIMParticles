package blackhat;

import java.util.ArrayList;
import java.util.List;

public class Sponsor {

    public String getSponsor(){
        List<String> sponsors = new ArrayList<>();
        sponsors.add("Pizza hut");
        sponsors.add("Burger king");
        sponsors.add("McDonalds");
        sponsors.add("Subway, eat fresh");
        sponsors.add("Pepsi");
        sponsors.add("Coca Cola");
        sponsors.add("Red bull");
        sponsors.add("Monster energy");
        sponsors.add("Newton");
        sponsors.add("Kirseberg Falafel");
        sponsors.add("Karlssons klister");
        sponsors.add("Ikea");
        sponsors.add("Volvo, AB");
        sponsors.add("H&M");
        sponsors.add("Vattenfall");
        sponsors.add("Dominos");
        sponsors.add("KFC");
        sponsors.add("Adidas");
        sponsors.add("Kärlek, vilket är det som får jorden att snurra");
        sponsors.add("Thaibox");
        sponsors.add("Pölsemannen");

        return sponsors.get((int)(Math.random() * sponsors.size()));
    }
}
